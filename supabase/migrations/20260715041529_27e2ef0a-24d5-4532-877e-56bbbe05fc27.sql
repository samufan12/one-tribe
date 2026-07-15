
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Reviewers can insert their own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND o.buyer_id = auth.uid()
    )
  );

CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_seller ON public.reviews(seller_id);

-- Update mark_order_delivered to include /review link in the notification message
CREATE OR REPLACE FUNCTION public.mark_order_delivered(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seller uuid;
  v_buyer uuid;
  v_product_id uuid;
  v_title text;
BEGIN
  SELECT seller_id, buyer_id, product_id INTO v_seller, v_buyer, v_product_id
  FROM public.orders WHERE id = p_order_id;

  IF v_seller IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  IF v_seller <> auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.orders SET status = 'delivered' WHERE id = p_order_id;

  SELECT title INTO v_title FROM public.products WHERE id = v_product_id;

  IF v_buyer IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_order_id, related_product_id)
    VALUES (
      v_buyer,
      'How was your order?',
      'Leave a review for ' || COALESCE(v_title, 'your item') || ' — it helps other buyers in the community. /review/' || p_order_id::text,
      'review_request',
      p_order_id,
      v_product_id
    );
  END IF;

  RETURN true;
END;
$$;
