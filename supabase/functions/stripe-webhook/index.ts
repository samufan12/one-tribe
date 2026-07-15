import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    log("Missing Stripe env vars");
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    log("Signature verification failed", { error: (err as Error).message });
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  log("Event received", { type: event.type, id: event.id });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};

      const productIdsStr = metadata.product_ids ?? "";
      const productIds = productIdsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const buyerId = metadata.buyer_id || null;
      const sellerId = metadata.seller_id || null;
      const platformFee = parseFloat(metadata.platform_fee ?? "0");
      const subtotal = parseFloat(metadata.subtotal ?? "0");
      const total = parseFloat(metadata.total ?? "0");
      const amountTotal = session.amount_total ?? 0; // cents

      // Fetch the payment intent to read application_fee_amount accurately
      let applicationFeeAmount = 0;
      if (session.payment_intent) {
        try {
          const piId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent.id;
          const pi = await stripe.paymentIntents.retrieve(piId);
          applicationFeeAmount = pi.application_fee_amount ?? 0;
        } catch (e) {
          log("Could not retrieve payment intent", { error: (e as Error).message });
        }
      }

      // If no Connect fee was charged, fall back to metadata-derived fee (cents)
      if (!applicationFeeAmount && platformFee > 0) {
        applicationFeeAmount = Math.round(platformFee * 100);
      }

      const sellerPayout = amountTotal - applicationFeeAmount;

      log("Inserting order", { buyerId, sellerId, amountTotal, applicationFeeAmount, sellerPayout });

      if (!buyerId) {
        log("Missing buyer_id in metadata — skipping order insert");
      } else {
        const { error: orderErr } = await admin.from("orders").insert({
          buyer_id: buyerId,
          seller_id: sellerId,
          product_id: productIds[0] ?? null,
          product_ids: productIds,
          stripe_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          subtotal: subtotal || amountTotal / 100,
          platform_fee: platformFee || applicationFeeAmount / 100,
          total: total || amountTotal / 100,
          amount_total: amountTotal,
          seller_payout: sellerPayout,
          status: "paid",
        });
        if (orderErr) {
          log("Order insert failed", { error: orderErr.message });
        } else {
          log("Order inserted");
        }
      }

      // Mark products as sold
      if (productIds.length > 0) {
        const { error: updErr } = await admin
          .from("products")
          .update({ status: "sold" })
          .in("id", productIds);
        if (updErr) {
          log("Product status update failed", { error: updErr.message });
        } else {
          log("Products marked sold", { count: productIds.length });
        }
      }

      // Fetch product title for notification messages
      let productTitle = "your item";
      if (productIds.length > 0) {
        const { data: productRow } = await admin
          .from("products")
          .select("title")
          .eq("id", productIds[0])
          .maybeSingle();
        if (productRow?.title) productTitle = productRow.title;
      }

      const amountStr = `$${(amountTotal / 100).toFixed(2)}`;

      // Notify seller
      if (sellerId) {
        const { error: sellerNotifErr } = await admin.from("notifications").insert({
          user_id: sellerId,
          type: "order_sold",
          title: "You made a sale! 🎉",
          message: `Someone bought ${productTitle} for ${amountStr}. Prepare it for shipment.`,
          related_product_id: productIds[0] ?? null,
        });
        if (sellerNotifErr) {
          log("Seller notification insert failed", { error: sellerNotifErr.message });
        } else {
          log("Seller notified", { sellerId });
        }
      }

      // Notify buyer
      if (buyerId) {
        const { error: buyerNotifErr } = await admin.from("notifications").insert({
          user_id: buyerId,
          type: "order_placed",
          title: "Order confirmed",
          message: `Your order for ${productTitle} is confirmed. The seller will ship it soon.`,
          related_product_id: productIds[0] ?? null,
        });
        if (buyerNotifErr) {
          log("Buyer notification insert failed", { error: buyerNotifErr.message });
        } else {
          log("Buyer notified", { buyerId });
        }
      }
    } else {
      log("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("Handler error", { error: msg });
    // Return 200 to prevent Stripe retries on internal processing errors we've already logged.
    // Switch to 500 if you want Stripe to retry.
    return new Response(JSON.stringify({ received: true, error: msg }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
