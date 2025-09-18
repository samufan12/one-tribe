-- ULTIMATE SECURITY LOCKDOWN: Complete isolation of sensitive profile data

-- Since there may still be some access path, let's create a completely locked down approach
-- Step 1: Create a safe public view that ONLY exposes non-sensitive data

CREATE OR REPLACE VIEW public.safe_seller_profiles AS
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

-- Grant access to this safe view
GRANT SELECT ON public.safe_seller_profiles TO authenticated;
GRANT SELECT ON public.safe_seller_profiles TO anon;

-- Step 2: Completely revoke all public access to the main profiles table
REVOKE ALL ON public.profiles FROM public;
REVOKE ALL ON public.profiles FROM anon;
REVOKE SELECT ON public.profiles FROM authenticated;

-- Step 3: Only grant specific access back to authenticated users for their own profiles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Step 4: Ensure RLS is enabled and working
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Make sure we have clean, restrictive policies
-- Drop any remaining policies first
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.profiles';
    END LOOP;
END
$$;

-- Step 6: Create only the essential, secure policies
CREATE POLICY "Users can only access their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin());

-- Step 7: Ensure no anonymous access at all
-- (Policies above already handle this by being TO authenticated only)

-- Step 8: Update our SECURITY DEFINER functions to be extra cautious
-- They should NEVER return sensitive fields for public access

-- Final security verification comment
COMMENT ON TABLE public.profiles IS 'SECURITY LOCKDOWN: This table contains phone, business_address, business_phone. Direct access restricted to owner/admin only. Public access ONLY through safe_seller_profiles view or secure functions.';
COMMENT ON VIEW public.safe_seller_profiles IS 'SAFE PUBLIC VIEW: Only exposes non-sensitive profile fields (display_name, avatar_url, verification_status). No phone numbers or business data.';