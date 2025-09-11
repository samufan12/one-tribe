-- Add admin role to the enum if it doesn't exist
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Create a secure function for role assignment that only admins can use
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Check if current user is an admin
  IF NOT public.has_role(current_user_id, 'admin') THEN
    RAISE EXCEPTION 'Only administrators can assign roles to users';
  END IF;
  
  -- Check if target user exists in profiles
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;
  
  -- Insert or update the role (upsert)
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Create a function to remove roles (admin only)
CREATE OR REPLACE FUNCTION public.remove_user_role(target_user_id uuid, role_to_remove app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Check if current user is an admin
  IF NOT public.has_role(current_user_id, 'admin') THEN
    RAISE EXCEPTION 'Only administrators can remove roles from users';
  END IF;
  
  -- Prevent removing admin role from themselves (to avoid lockout)
  IF current_user_id = target_user_id AND role_to_remove = 'admin' THEN
    RAISE EXCEPTION 'Administrators cannot remove their own admin role';
  END IF;
  
  -- Remove the role
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = role_to_remove;
  
  RETURN true;
END;
$$;

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only system can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "System functions can insert roles" ON public.user_roles;

-- Create new restrictive RLS policies
CREATE POLICY "Prevent all user inserts" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Allow service role to insert (for triggers and system functions)
CREATE POLICY "Allow service role inserts" 
ON public.user_roles 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Create a function for users to request seller status (requires admin approval)
CREATE OR REPLACE FUNCTION public.request_seller_status()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Check if user is already a seller
  IF public.has_role(current_user_id, 'seller') THEN
    RAISE EXCEPTION 'User is already a seller';
  END IF;
  
  -- Here you could insert into a requests table for admin approval
  -- For now, we'll just log that they requested it
  RAISE NOTICE 'Seller status request logged for user %', current_user_id;
  RETURN true;
END;
$$;