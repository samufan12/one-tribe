-- 1. Tighten is_admin: drop caller-supplied parameter
-- Recreate policies that depend on it first
DROP POLICY IF EXISTS "Admins have full access to all profiles" ON public.profiles;

DROP FUNCTION IF EXISTS public.is_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

CREATE POLICY "Admins have full access to all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2. Restrict community_posts direct reads to authenticated users
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;
CREATE POLICY "Authenticated users can view community posts"
ON public.community_posts
FOR SELECT
TO authenticated
USING (true);

-- 3. Restrict community_post_likes reads to authenticated users
DROP POLICY IF EXISTS "Anyone can view post likes" ON public.community_post_likes;
CREATE POLICY "Authenticated users can view post likes"
ON public.community_post_likes
FOR SELECT
TO authenticated
USING (true);

-- 4. Fix mutable search_path on admin list functions
CREATE OR REPLACE FUNCTION public.admin_list_profiles()
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.profiles
  WHERE public.has_role(auth.uid(), 'admin');
$$;

CREATE OR REPLACE FUNCTION public.admin_list_orders()
RETURNS SETOF public.orders
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.orders
  WHERE public.has_role(auth.uid(), 'admin');
$$;