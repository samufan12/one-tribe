
CREATE OR REPLACE FUNCTION public.get_seller_orders()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  status text,
  amount_total integer,
  seller_payout integer,
  total numeric,
  product_id uuid,
  product_title text,
  buyer_id uuid,
  buyer_display_name text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    o.id,
    o.created_at,
    o.status,
    o.amount_total,
    o.seller_payout,
    o.total,
    o.product_id,
    p.title AS product_title,
    o.buyer_id,
    prof.display_name AS buyer_display_name
  FROM public.orders o
  LEFT JOIN public.products p ON p.id = o.product_id
  LEFT JOIN public.profiles prof ON prof.user_id = o.buyer_id
  WHERE o.seller_id = auth.uid()
  ORDER BY o.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_seller_orders() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_seller_orders() TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_order_shipped(p_order_id uuid)
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

  UPDATE public.orders SET status = 'shipped' WHERE id = p_order_id;

  SELECT title INTO v_title FROM public.products WHERE id = v_product_id;

  IF v_buyer IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_order_id, related_product_id)
    VALUES (
      v_buyer,
      'Your order is on its way!',
      'Your order for ' || COALESCE(v_title, 'your item') || ' has been shipped. It''s on its way to you.',
      'order_shipped',
      p_order_id,
      v_product_id
    );
  END IF;

  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_order_shipped(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.mark_order_shipped(uuid) TO authenticated;

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
      'Your order for ' || COALESCE(v_title, 'your item') || ' has been delivered. Leave a review to help other buyers!',
      'review_request',
      p_order_id,
      v_product_id
    );
  END IF;

  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_order_delivered(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.mark_order_delivered(uuid) TO authenticated;
