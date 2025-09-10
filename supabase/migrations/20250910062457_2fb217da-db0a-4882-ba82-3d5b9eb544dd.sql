-- Fix the search_path issues in the functions I created
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
  -- In a full implementation, you'd create a seller_requests table
  
  RAISE NOTICE 'Seller status request logged for user %', current_user_id;
  RETURN true;
END;
$$;