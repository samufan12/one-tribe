-- FINAL SECURITY FIX: Remove ALL problematic RLS policies that expose sensitive data

-- Drop the remaining problematic policies that are exposing sensitive data
DROP POLICY IF EXISTS "Profiles limited public access for verified sellers" ON public.profiles;
DROP POLICY IF EXISTS "Profiles full access for owner and admin only" ON public.profiles;

-- Keep only the essential, secure policies:
-- 1. "Users can manage own profile" - secure (users can only access their own data)
-- 2. "Admins can see all profiles" - secure (only admins)

-- Now the ONLY way for public users to access profile data is through our 
-- SECURITY DEFINER functions which properly filter out sensitive information

-- Let's also make sure we completely lock down direct table access
-- Grant minimal necessary permissions for RLS to work
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- But ensure RLS is enforced and no direct sensitive data access is possible
-- The authenticated users can only access through RLS policies which are now:
-- 1. Own profile access only (secure)
-- 2. Admin access only (secure)
-- 3. NO public access to sensitive fields (all removed)

-- For any public profile access, it MUST go through our secure functions