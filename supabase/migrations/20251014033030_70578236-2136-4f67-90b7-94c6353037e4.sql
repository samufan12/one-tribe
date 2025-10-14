-- Fix: Remove the redundant and problematic safe_seller_profiles view
-- 
-- REASON: This view was causing "permission denied" errors because:
-- 1. The view queries the profiles table
-- 2. We revoked SELECT on profiles from anon/authenticated
-- 3. PostgreSQL checks underlying table permissions even when querying views
-- 4. Making the view SECURITY DEFINER would be a security risk
--
-- SOLUTION: We already have properly secured SECURITY DEFINER functions that
-- provide the same functionality safely:
-- - get_seller_profiles() - returns safe seller profiles
-- - get_all_public_profiles() - returns all public profiles
-- - get_public_profile(user_id) - returns a single profile
--
-- These functions properly handle security context and filter sensitive data.

-- Drop the problematic view
DROP VIEW IF EXISTS public.safe_seller_profiles CASCADE;

-- Update comment on profiles table to reflect the secure access pattern
COMMENT ON TABLE public.profiles IS 
'SECURITY: Direct access restricted to owner/admin via RLS. 
Public access ONLY through secure SECURITY DEFINER functions:
- get_seller_profiles(): Returns safe seller profiles (no sensitive data)
- get_all_public_profiles(): Returns all public profiles (filters by admin status)
- get_public_profile(user_id): Returns single profile (filters sensitive fields)
These functions properly check authentication and authorization.';

-- Verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add helpful comment for developers
COMMENT ON FUNCTION public.get_seller_profiles() IS 
'SAFE PUBLIC ACCESS: Returns only non-sensitive verified seller profiles. 
Admins see business_name, public users see only display_name, avatar_url, verification_status.';

COMMENT ON FUNCTION public.get_all_public_profiles() IS 
'SAFE PUBLIC ACCESS: Returns public profiles with role-based filtering. 
Admins see full data, public users see only non-sensitive fields.';

COMMENT ON FUNCTION public.get_public_profile(uuid) IS 
'SAFE PUBLIC ACCESS: Returns a single profile with proper access control. 
Users can see their own full profile, admins see all profiles, public sees only verified seller basics.';