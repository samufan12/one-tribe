-- Fix search path for existing functions that don't have it set properly
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.edge_functions_ai_assistant()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- This function exists to track edge function creation in migrations
  -- The actual edge function will be created separately
  NULL;
END;
$$;