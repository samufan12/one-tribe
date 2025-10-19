-- ============================================
-- PRIVACY ENHANCEMENT: COMPLETE ANONYMITY
-- ============================================

-- 1. Create function to get anonymous product listings (hides seller identity)
CREATE OR REPLACE FUNCTION public.get_public_products()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  price numeric,
  category text,
  condition text,
  size text,
  location text,
  images text[],
  likes integer,
  views integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return products WITHOUT user_id to protect seller privacy
  RETURN QUERY
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      p.category,
      p.condition,
      p.size,
      p.location,
      p.images,
      p.likes,
      p.views,
      p.created_at
    FROM public.products p
    WHERE p.status = 'active';
END;
$$;

-- 2. Create function to get product like count (without exposing who liked)
CREATE OR REPLACE FUNCTION public.get_product_like_count(product_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.product_likes
  WHERE product_id = $1;
$$;

-- 3. Create function to check if current user liked a product
CREATE OR REPLACE FUNCTION public.has_user_liked_product(product_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.product_likes
    WHERE product_id = $1
      AND user_id = auth.uid()
  );
$$;

-- 4. Update product_likes RLS to prevent sellers from seeing who liked their products
DROP POLICY IF EXISTS "Users can view relevant likes" ON public.product_likes;

CREATE POLICY "Users can only view their own likes"
ON public.product_likes
FOR SELECT
USING (auth.uid() = user_id);

-- 5. Add comment to phone field warning about privacy
COMMENT ON COLUMN public.profiles.phone IS 'PRIVATE: Never expose in public UI. Only visible to profile owner and admins.';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_public_products() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_product_like_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_user_liked_product(uuid) TO authenticated;