
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

CREATE POLICY "Buyers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);
