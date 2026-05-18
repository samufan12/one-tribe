import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLATFORM_FEE_RATE = 0.08; // 8% — taken from seller payout, not added to buyer price

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

// Client only provides product IDs + quantities; prices come from the database
const lineItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive().max(100).default(1),
});

const bodySchema = z.object({
  items: z.array(lineItemSchema).min(1).max(50).optional(),
  productId: z.string().uuid().optional(),
  quantity: z.number().int().positive().max(100).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Service role client for reading seller stripe_account_id (bypasses RLS on profiles)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Require authentication
    let userId: string;
    let userEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    userId = authData.user.id;
    userEmail = authData.user.email;
    logStep("User authenticated", { email: userEmail });

    // Rate limiting for authenticated users
    if (userId) {
      const { data: withinLimit, error: rlError } = await supabaseClient
        .rpc('check_rate_limit', {
          p_user_id: userId,
          p_action: 'create_payment',
          p_window_minutes: 15,
          p_max_requests: 10,
        });

      if (rlError) {
        console.error('Rate limit check error:', rlError);
      } else if (!withinLimit) {
        logStep("Rate limit exceeded", { userId });
        return new Response(
          JSON.stringify({ error: "Too many payment requests. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabaseClient.rpc('log_rate_limited_action', { p_action: 'create_payment' });
    }

    // Validate input
    const rawBody = await req.json();
    const validation = bodySchema.safeParse(rawBody);
    if (!validation.success) {
      logStep("Validation failed", { errors: validation.error.errors });
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: validation.error.errors[0]?.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = validation.data;

    let requestedItems: { productId: string; quantity: number }[];

    if (body.items && body.items.length > 0) {
      requestedItems = body.items.map((i) => ({ productId: i.productId, quantity: i.quantity || 1 }));
    } else if (body.productId) {
      requestedItems = [{ productId: body.productId, quantity: body.quantity || 1 }];
    } else {
      return new Response(
        JSON.stringify({ error: "Missing required fields: provide items array or productId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Items requested", { count: requestedItems.length });

    // Fetch authoritative product data (price, title, seller, status) from DB
    const productIds = requestedItems.map((i) => i.productId);
    const { data: productRows, error: productsErr } = await supabaseAdmin
      .from("products")
      .select("id, title, price, user_id, status")
      .in("id", productIds);

    if (productsErr || !productRows || productRows.length === 0) {
      logStep("Product lookup failed", { error: productsErr?.message });
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productMap = new Map(productRows.map((p: any) => [p.id, p]));
    const lineItems: { productId: string; productTitle: string; price: number; quantity: number; sellerId: string }[] = [];

    for (const item of requestedItems) {
      const p: any = productMap.get(item.productId);
      if (!p) {
        return new Response(
          JSON.stringify({ error: `Product ${item.productId} not found` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (p.status !== "active") {
        return new Response(
          JSON.stringify({ error: `Product ${item.productId} is not available` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      lineItems.push({
        productId: p.id,
        productTitle: p.title,
        price: Number(p.price),
        quantity: item.quantity,
        sellerId: p.user_id,
      });
    }

    // Stripe Connect requires a single seller per session
    const sellerId = lineItems[0].sellerId;
    if (lineItems.some((i) => i.sellerId !== sellerId)) {
      return new Response(
        JSON.stringify({ error: "All items must be from the same seller" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = subtotal * PLATFORM_FEE_RATE;
    const total = subtotal;

    logStep("Fee calculated", { subtotal, platformFee, total });

    const { data: sellerProfile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_account_id")
      .eq("user_id", sellerId)
      .maybeSingle();

    const sellerStripeAccountId = sellerProfile?.stripe_account_id as string | null | undefined;
    logStep("Seller resolved", { sellerId, hasStripeAccount: !!sellerStripeAccountId });

    const firstProductId = lineItems[0].productId;

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Build Stripe line items — product prices only, no separate fee line
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

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
        seller_id: sellerId,
        seller_onboarded: sellerStripeAccountId ? "true" : "false",
      },
    };

    if (sellerStripeAccountId) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(subtotal * PLATFORM_FEE_RATE * 100),
        transfer_data: { destination: sellerStripeAccountId },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

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
