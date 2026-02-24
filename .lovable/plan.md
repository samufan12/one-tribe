

# Platform Fee Implementation (5% Cut)

## Overview
Add a 5% platform fee to every transaction using **Stripe Connect** with destination charges. This is the industry-standard way to collect a platform cut -- Stripe splits the payment automatically so you receive your fee and the seller gets the rest.

## How It Works

The current checkout flow sends the full payment amount to your Stripe account. To split payments between you (the platform) and sellers, we need to use **Stripe Connect**. However, Stripe Connect requires each seller to have a connected Stripe account, which adds significant onboarding complexity.

**Simpler alternative (recommended for now):** Since all payments currently go to your single Stripe account, the simplest approach is to:
1. Add a visible **platform fee line item** or display it in the order summary so buyers see the breakdown
2. Calculate the 5% fee in the `create-payment` edge function
3. Show the fee transparently in the Cart and Product Detail pages
4. Track the seller payout amounts in your database for manual settlement

This avoids Stripe Connect complexity while still tracking your cut.

## Changes

### 1. Edge Function: `create-payment` (update)
- Calculate a 5% platform fee from the subtotal
- Add the fee as a separate Stripe Checkout line item so it appears transparently on the Stripe receipt
- Store fee metadata in the Stripe session for record-keeping

### 2. Cart Page: `src/pages/Cart.tsx` (update)
- Show a fee breakdown in the order summary section:
  - Subtotal
  - Platform fee (5%)
  - Total
- Update the checkout button label to reflect the final total

### 3. Product Detail Page: `src/pages/ProductDetail.tsx` (update)
- Show the 5% fee in the "Buy Now" flow price display so buyers aren't surprised at checkout

### 4. Database: `orders` table (new migration)
- Create an `orders` table to record completed purchases with:
  - `id`, `user_id` (buyer), `seller_id`, `product_ids`, `subtotal`, `platform_fee`, `total`, `stripe_session_id`, `status`, `created_at`
- Add RLS policies so buyers can see their own orders and sellers can see orders for their products

### 5. Payment Success Page: `src/pages/PaymentSuccess.tsx` (update)
- Optionally verify the session and record the order in the `orders` table

---

## Technical Details

### Fee Calculation (Edge Function)
```
subtotal = sum of (item.price * item.quantity)
platform_fee = subtotal * 0.05
total = subtotal + platform_fee
```

The fee is added as a separate line item in Stripe Checkout:
```typescript
stripeLineItems.push({
  price_data: {
    currency: "usd",
    product_data: { name: "Platform Fee (5%)" },
    unit_amount: Math.round(subtotal * 100 * 0.05),
  },
  quantity: 1,
});
```

### Orders Table Schema
```sql
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  stripe_session_id text,
  subtotal numeric NOT NULL,
  platform_fee numeric NOT NULL,
  total numeric NOT NULL,
  product_ids text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id);
```

### Cart UI Breakdown
The cart summary section will show:
```text
Subtotal:       $100.00
Platform Fee:    $5.00
-----------------------
Total:         $105.00
```

### Files Modified
| File | Change |
|---|---|
| `supabase/functions/create-payment/index.ts` | Add 5% fee line item to Stripe Checkout |
| `src/pages/Cart.tsx` | Show subtotal, fee, and total breakdown |
| `src/pages/ProductDetail.tsx` | Show fee info near Buy Now button |
| New migration | Create `orders` table with RLS |

