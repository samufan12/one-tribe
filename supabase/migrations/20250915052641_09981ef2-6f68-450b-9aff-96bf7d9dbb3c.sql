-- Harden public profile access and restrict function execution to authenticated users

-- 1) Replace function: get_all_public_profiles
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

-- 2) Replace function: get_seller_profiles (limit to verified sellers and drop sensitive fields)
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

-- 3) Replace function: get_public_profile
-- Owners see full details (including bio). Non-owners only see limited fields for verified sellers.
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
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = profile_user_id AND ur.role = 'seller'
  ) INTO is_target_seller;

  SELECT (verification_status = 'verified') 
  FROM public.profiles 
  WHERE user_id = profile_user_id 
  INTO is_target_verified;

  IF requester = profile_user_id THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, p.business_name, p.verification_status, p.created_at, p.bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  ELSIF is_target_seller AND is_target_verified THEN
    RETURN QUERY
      SELECT p.user_id, p.display_name, p.avatar_url, p.business_name, p.verification_status, p.created_at, NULL::text AS bio
      FROM public.profiles p
      WHERE p.user_id = profile_user_id;
  ELSE
    RAISE EXCEPTION 'Profile is not publicly accessible';
  END IF;
END;
$function$;

-- 4) Tighten permissions: revoke execute from anon, allow authenticated
REVOKE ALL ON FUNCTION public.get_all_public_profiles() FROM anon;
REVOKE ALL ON FUNCTION public.get_seller_profiles() FROM anon;
REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_all_public_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_seller_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;
