-- Fix critical security issues

-- 1. Fix profiles table: Add policy to restrict unauthenticated access
DROP POLICY IF EXISTS "Public cannot access profiles" ON public.profiles;
CREATE POLICY "Public cannot access profiles" 
ON public.profiles 
FOR SELECT 
USING (false);

-- Ensure this policy is evaluated before the authenticated user policies
-- by making it more restrictive

-- 2. Fix product_likes table: Restrict who can view likes
DROP POLICY IF EXISTS "Users can view all likes" ON public.product_likes;
CREATE POLICY "Users can view relevant likes" 
ON public.product_likes 
FOR SELECT 
USING (
  -- Users can view their own likes
  auth.uid() = user_id 
  OR 
  -- Users can view likes on their own products
  EXISTS (
    SELECT 1 
    FROM public.products 
    WHERE products.id = product_likes.product_id 
    AND products.user_id = auth.uid()
  )
);