
CREATE OR REPLACE FUNCTION public.get_other_products_by_seller(
  p_seller_id uuid,
  p_exclude_product_id uuid,
  p_limit integer DEFAULT 4
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  category text,
  condition text,
  images text[],
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.title, p.price, p.category, p.condition, p.images, p.created_at
  FROM public.products p
  WHERE p.user_id = p_seller_id
    AND p.status = 'active'
    AND p.id <> p_exclude_product_id
  ORDER BY p.created_at DESC
  LIMIT GREATEST(p_limit, 0);
$$;

REVOKE EXECUTE ON FUNCTION public.get_other_products_by_seller(uuid, uuid, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_other_products_by_seller(uuid, uuid, integer) TO anon, authenticated;
