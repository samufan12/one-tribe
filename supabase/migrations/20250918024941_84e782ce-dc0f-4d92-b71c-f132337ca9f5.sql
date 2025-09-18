-- CRITICAL SECURITY FIX: Remove public access to sensitive profile data
-- The issue is that our RLS policy allows public SELECT to all fields for verified sellers
-- This exposes phone numbers, business addresses, and other sensitive data

-- Remove the problematic public access policy
DROP POLICY IF EXISTS "Public can see verified seller basic info" ON public.profiles;

-- DO NOT create any public SELECT policy that exposes sensitive data
-- Instead, we'll rely ONLY on our secure SECURITY DEFINER functions that properly filter data

-- Ensure our existing policies are correct:
-- 1. Users can manage their own profiles (keeps existing)
-- 2. Admins can see everything (keeps existing) 
-- 3. NO public access to raw profile data

-- Let's also ensure our secure functions are the ONLY way to access profile data publicly
-- by creating a comment to document this security decision
COMMENT ON TABLE public.profiles IS 'SECURITY: Public access to profile data MUST only be through secure functions like get_public_profile(), get_seller_profiles(), etc. Never allow direct SELECT policies that expose sensitive fields like phone, business_address, business_phone.';

-- Verify our current policies are secure by ensuring no public access to sensitive fields
-- The only policies should be:
-- 1. "Users can manage own profile" - allows users to manage their own data
-- 2. "Admins can see all profiles" - allows admins to see everything
-- No other SELECT policies should exist that allow public access