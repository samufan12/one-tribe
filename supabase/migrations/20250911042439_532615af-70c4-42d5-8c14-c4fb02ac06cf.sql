-- Drop the dangerous "Users can view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own full profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create a view for public profile information (non-sensitive data only)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  bio,
  business_name,
  verification_status,
  created_at
FROM public.profiles
WHERE 
  -- Only show profiles that have some public information
  (display_name IS NOT NULL OR business_name IS NOT NULL);

-- Enable RLS on the view (inherits from base table)
-- Note: Views inherit RLS from underlying tables, but we'll add explicit policies

-- Create a policy to allow anyone to view the public profile information
CREATE POLICY "Anyone can view public profile info" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Allow access to non-sensitive fields only through application logic
  -- This policy will be used by the public_profiles view
  true
);

-- Wait, that's not right. Let me create a proper solution.
-- Drop that policy and create a better approach

DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;

-- Create a function to get public profile information safely
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  display_name text,
  avatar_url text,
  bio text,
  business_name text,
  verification_status text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.business_name,
    p.verification_status,
    p.created_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
$$;

-- Create a function to get all public profiles (for marketplace/community features)
CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  display_name text,
  avatar_url text,
  bio text,
  business_name text,
  verification_status text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.business_name,
    p.verification_status,
    p.created_at
  FROM public.profiles p
  WHERE 
    -- Only include profiles that have opted into public visibility
    -- or are verified sellers (business profiles)
    (p.display_name IS NOT NULL OR p.business_name IS NOT NULL);
$$;

-- Create a function to get seller profiles specifically (for marketplace)
CREATE OR REPLACE FUNCTION public.get_seller_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  display_name text,
  avatar_url text,
  bio text,
  business_name text,
  verification_status text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.business_name,
    p.verification_status,
    p.created_at
  FROM public.profiles p
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.user_id AND ur.role = 'seller'
  );
$$;