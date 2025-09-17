-- Fix security vulnerability in profiles table
-- Problem: SECURITY DEFINER functions are exposing sensitive business data to unauthorized users

-- 1. First, let's create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

-- 2. Update get_public_profile to only show safe public data
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE(
  user_id uuid, 
  display_name text, 
  avatar_url text, 
  business_name text, 
  verification_status text, 
  created_at timestamp with time zone, 
  bio text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester uuid := auth.uid();
  is_target_seller boolean;
  is_target_verified boolean;
  is_requester_admin boolean;
BEGIN
  -- Check if target user is a seller
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = profile_user_id AND ur.role = 'seller'
  ) INTO is_target_seller;

  -- Check if target user is verified
  SELECT (verification_status = 'verified') 
  FROM public.profiles 
  WHERE user_id = profile_user_id 
  INTO is_target_verified;

  -- Check if requester is admin
  SELECT public.is_admin(requester) INTO is_requester_admin;

  -- If requesting own profile or user is admin - return full profile
  IF requester = profile_user_id OR is_requester_admin THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, p.business_name, p.verification_status, p.created_at, p.bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  -- If target is verified seller - return limited public info (NO sensitive business data)
  ELSIF is_target_seller AND is_target_verified THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, 
             NULL::text AS business_name,  -- Hide business name
             p.verification_status, 
             p.created_at, 
             NULL::text AS bio             -- Hide bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  ELSE
    -- Profile is not publicly accessible
    RAISE EXCEPTION 'Profile is not publicly accessible';
  END IF;
END;
$$;

-- 3. Update get_seller_profiles to only show safe public data
CREATE OR REPLACE FUNCTION public.get_seller_profiles()
RETURNS TABLE(
  user_id uuid, 
  display_name text, 
  avatar_url text, 
  business_name text, 
  verification_status text, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester uuid := auth.uid();
  is_requester_admin boolean;
BEGIN
  -- Check if requester is admin
  SELECT public.is_admin(requester) INTO is_requester_admin;

  -- Only admins can see business names and sensitive data
  IF is_requester_admin THEN
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        p.business_name,  -- Full data for admins
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  ELSE
    -- Public users only see safe data
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        NULL::text AS business_name,  -- Hide sensitive business data
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  END IF;
END;
$$;

-- 4. Update get_all_public_profiles (same logic as get_seller_profiles)
CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
RETURNS TABLE(
  user_id uuid, 
  display_name text, 
  avatar_url text, 
  business_name text, 
  verification_status text, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester uuid := auth.uid();
  is_requester_admin boolean;
BEGIN
  -- Check if requester is admin
  SELECT public.is_admin(requester) INTO is_requester_admin;

  -- Only admins can see business names and sensitive data
  IF is_requester_admin THEN
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        p.business_name,  -- Full data for admins
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  ELSE
    -- Public users only see safe data
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        NULL::text AS business_name,  -- Hide sensitive business data
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  END IF;
END;
$$;

-- 5. Add additional RLS policy to ensure phone and business data is extra protected
CREATE POLICY "Profiles sensitive data only for owner or admin"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id OR public.is_admin()
);

-- 6. Create a safe public view for seller listings that only exposes non-sensitive data
CREATE OR REPLACE VIEW public.public_seller_profiles AS
SELECT 
  p.user_id,
  p.display_name,
  p.avatar_url,
  p.verification_status,
  p.created_at
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = p.user_id AND ur.role = 'seller'
)
AND p.verification_status = 'verified';

-- Grant select access to authenticated users on the safe view
GRANT SELECT ON public.public_seller_profiles TO authenticated;