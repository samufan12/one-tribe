-- COMPREHENSIVE SECURITY FIX: Ensure no sensitive data exposure
-- Let's completely lock down the profiles table and verify our functions are secure

-- First, let's see what our SECURITY DEFINER functions are actually returning
-- and make sure they're not exposing sensitive data

-- Update get_public_profile to be even more restrictive for public access
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
  -- For public access to verified sellers - return ONLY safe, non-sensitive data
  ELSIF is_target_seller AND is_target_verified THEN
    RETURN QUERY
      SELECT p.user_id, 
             p.display_name, 
             p.avatar_url, 
             NULL::text AS business_name,     -- HIDE sensitive business name
             p.verification_status, 
             p.created_at, 
             NULL::text AS bio                -- HIDE sensitive bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  ELSE
    -- Profile is not publicly accessible - return empty result
    RETURN;
  END IF;
END;
$$;

-- Update get_seller_profiles to be more restrictive for public users
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
        p.business_name,  -- Full data for admins only
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  ELSE
    -- Public users see ONLY basic, non-sensitive information
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        NULL::text AS business_name,  -- COMPLETELY HIDE business data from public
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

-- Make sure get_all_public_profiles has the same security
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
        p.business_name,  -- Full data for admins only
        p.verification_status,
        p.created_at
      FROM public.profiles p
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = p.user_id AND ur.role = 'seller'
      )
      AND p.verification_status = 'verified';
  ELSE
    -- Public users see ONLY basic, non-sensitive information
    RETURN QUERY
      SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        NULL::text AS business_name,  -- COMPLETELY HIDE business data from public
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

-- Additional security: Revoke any direct grants on the profiles table
-- and ensure it's only accessible through our secure functions
REVOKE ALL ON public.profiles FROM authenticated;
REVOKE ALL ON public.profiles FROM anon;

-- Grant only necessary permissions back through the secure functions
-- The functions themselves have SECURITY DEFINER so they can access the table
-- but external users cannot directly query it

-- Add additional security comment
COMMENT ON TABLE public.profiles IS 'SECURITY CRITICAL: This table contains sensitive PII including phone numbers and business addresses. Access is STRICTLY controlled through SECURITY DEFINER functions only. Never grant direct SELECT permissions. All public access must go through get_public_profile(), get_seller_profiles(), etc. which filter sensitive data.';