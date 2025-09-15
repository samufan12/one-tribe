-- Drop existing functions first, then recreate with enhanced privacy

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_all_public_profiles();
DROP FUNCTION IF EXISTS public.get_seller_profiles();
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

-- 1) Create hardened get_all_public_profiles (only verified sellers, no sensitive data)
CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
RETURNS TABLE(
  user_id uuid,
  display_name text,
  avatar_url text,
  business_name text,
  verification_status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.business_name,
    p.verification_status,
    p.created_at
  FROM public.profiles p
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.user_id AND ur.role = 'seller'
  )
  AND p.verification_status = 'verified';
$function$;

-- 2) Create hardened get_seller_profiles (only verified sellers)
CREATE OR REPLACE FUNCTION public.get_seller_profiles()
RETURNS TABLE(
  user_id uuid,
  display_name text,
  avatar_url text,
  business_name text,
  verification_status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.business_name,
    p.verification_status,
    p.created_at
  FROM public.profiles p
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.user_id AND ur.role = 'seller'
  )
  AND p.verification_status = 'verified';
$function$;

-- 3) Create hardened get_public_profile (owner gets full data, others get limited verified seller info)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  avatar_url text,
  business_name text,
  verification_status text,
  created_at timestamptz,
  bio text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requester uuid := auth.uid();
  is_target_seller boolean;
  is_target_verified boolean;
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

  -- If requesting own profile, return full data
  IF requester = profile_user_id THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, p.business_name, p.verification_status, p.created_at, p.bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  -- If requesting verified seller profile, return limited data
  ELSIF is_target_seller AND is_target_verified THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, p.business_name, p.verification_status, p.created_at, NULL::text AS bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  -- Otherwise, deny access
  ELSE
    RAISE EXCEPTION 'Profile is not publicly accessible';
  END IF;
END;
$function$;

-- 4) Restrict function execution to authenticated users only
REVOKE ALL ON FUNCTION public.get_all_public_profiles() FROM anon;
REVOKE ALL ON FUNCTION public.get_seller_profiles() FROM anon;
REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_all_public_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_seller_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;