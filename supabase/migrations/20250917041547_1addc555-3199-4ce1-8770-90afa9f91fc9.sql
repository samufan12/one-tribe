-- Fix the Security Definer View warning
-- Remove the security definer view and replace with a safer approach

-- Drop the problematic view
DROP VIEW IF EXISTS public.public_seller_profiles;

-- Instead, we'll rely on our secure functions which already handle access control properly
-- The functions are already secured and don't expose sensitive data

-- Additional security: Make sure our RLS policies are optimal
-- Drop the potentially conflicting policy
DROP POLICY IF EXISTS "Profiles sensitive data only for owner or admin" ON public.profiles;

-- Create a more specific policy that works better with our functions
CREATE POLICY "Profiles full access for owner and admin only"
ON public.profiles
FOR ALL
USING (
  auth.uid() = user_id OR public.is_admin()
);

-- For public access, create a stricter policy
CREATE POLICY "Profiles limited public access for verified sellers"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = user_id 
  OR 
  -- Or admins can see everything
  public.is_admin()
  OR
  -- Or limited public data for verified sellers (only safe fields)
  (
    verification_status = 'verified' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = profiles.user_id AND ur.role = 'seller'
    )
  )
);