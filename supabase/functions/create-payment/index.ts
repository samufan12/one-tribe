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

// Input validation schemas
const lineItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  productTitle: z.string().trim().min(1).max(200),
  price: z.number().positive().max(999999),
  quantity: z.number().int().positive().max(100).default(1),
});

const bodySchema = z.object({
  items: z.array(lineItemSchema).min(1).max(50).optional(),
  productId: z.string().uuid().optional(),
  productTitle: z.string().trim().min(1).max(200).optional(),
  price: z.number().positive().max(999999).optional(),
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

    // Authenticate user
    let userId: string | undefined;
    let userEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email;
        logStep("User authenticated", { email: userEmail });
      }
    }

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

    let lineItems: { productId: string; productTitle: string; price: number; quantity: number }[];

    if (body.items && body.items.length > 0) {
      lineItems = body.items;
    } else if (body.productId && body.productTitle && body.price) {
      lineItems = [{ productId: body.productId, productTitle: body.productTitle, price: body.price, quantity: body.quantity || 1 }];
    } else {
      return new Response(
        JSON.stringify({ error: "Missing required fields: provide items array or productId, productTitle, price" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Line items parsed", { count: lineItems.length });

    // Calculate subtotal — fee is deducted from seller payout, not added to buyer total
    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = subtotal * PLATFORM_FEE_RATE;
    const total = subtotal; // buyer only pays product price

    logStep("Fee calculated", { subtotal, platformFee, total });

    // Look up product/seller info — Stripe Connect requires a single seller per session
    const firstProductId = lineItems[0].productId;
    const { data: productRow, error: productErr } = await supabaseAdmin
      .from("products")
      .select("user_id")
      .eq("id", firstProductId)
      .maybeSingle();

    if (productErr || !productRow) {
      logStep("Product lookup failed", { error: productErr?.message });
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sellerId = productRow.user_id as string;

    const { data: sellerProfile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_account_id")
      .eq("user_id", sellerId)
      .maybeSingle();

    const sellerStripeAccountId = sellerProfile?.stripe_account_id as string | null | undefined;
    logStep("Seller resolved", { sellerId, hasStripeAccount: !!sellerStripeAccountId });

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
