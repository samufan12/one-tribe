
-- 1 & 2: Profiles — drop overly-permissive public-role policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public cannot access profiles" ON public.profiles;
-- Remaining policies: "Users can only access their own profile" (authenticated) and "Admins have full access to all profiles" (authenticated) cover all needs.

-- 3: Products — restrict to authenticated role
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;

CREATE POLICY "Users can create their own products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own products"
  ON public.products FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 4: Storage — enforce folder ownership on upload
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
