
-- Get the seller user_id for a product (used for messaging)
CREATE OR REPLACE FUNCTION public.get_product_seller_id(p_product_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.products WHERE id = p_product_id AND status = 'active';
$$;
