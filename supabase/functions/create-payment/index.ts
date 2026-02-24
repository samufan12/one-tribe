import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLATFORM_FEE_RATE = 0.05; // 5%

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const body = await req.json();

    // Support both single item (legacy) and multi-item cart
    let lineItems: { productId: string; productTitle: string; price: number; quantity: number }[];

    if (body.items && Array.isArray(body.items)) {
      lineItems = body.items;
    } else {
      const { productId, productTitle, price, quantity = 1 } = body;
      if (!productId || !productTitle || !price) {
        throw new Error("Missing required fields: productId, productTitle, price");
      }
      lineItems = [{ productId, productTitle, price, quantity }];
    }

    logStep("Line items parsed", { count: lineItems.length });

    // Calculate subtotal and platform fee
    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = subtotal * PLATFORM_FEE_RATE;
    const total = subtotal + platformFee;

    logStep("Fee calculated", { subtotal, platformFee, total });

    // Try to get authenticated user
    let userEmail: string | undefined;
    let customerId: string | undefined;
    let userId: string | undefined;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        userId = data.user.id;
        logStep("User authenticated", { email: userEmail });
      }
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Build Stripe line items for products
    const stripeLineItems = lineItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productTitle,
          metadata: { product_id: item.productId },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add platform fee as a separate line item
    stripeLineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Platform Fee (5%)",
          metadata: { type: "platform_fee" },
        },
        unit_amount: Math.round(platformFee * 100),
      },
      quantity: 1,
    });

    const firstProductId = lineItems[0].productId;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/${lineItems.length > 1 ? "cart" : `product/${firstProductId}`}`,
      metadata: {
        product_ids: lineItems.map((i) => i.productId).join(","),
        subtotal: subtotal.toFixed(2),
        platform_fee: platformFee.toFixed(2),
        total: total.toFixed(2),
        buyer_id: userId || "",
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
