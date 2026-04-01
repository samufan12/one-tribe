
-- Generic rate limit function that can be used by any edge function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action text,
  p_window_minutes integer DEFAULT 60,
  p_max_requests integer DEFAULT 30
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_count integer;
BEGIN
  -- Reuse ai_assistant_usage for AI, but for other actions use a generic approach
  -- For now, we use ai_assistant_usage table structure for payment tracking too
  -- A more scalable approach: create a generic rate_limit_logs table
  RETURN true; -- placeholder, real implementation below
END;
$$;

-- Create a generic rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- No direct access - only through security definer functions
CREATE POLICY "No direct access" ON public.rate_limit_logs FOR ALL TO authenticated USING (false);

-- Create index for efficient lookups
CREATE INDEX idx_rate_limit_logs_lookup ON public.rate_limit_logs (user_id, action, created_at DESC);

-- Now create the real rate limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action text,
  p_window_minutes integer DEFAULT 60,
  p_max_requests integer DEFAULT 30
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_count integer;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM public.rate_limit_logs
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > now() - (p_window_minutes || ' minutes')::interval;
  
  RETURN request_count < p_max_requests;
END;
$$;

-- Function to log rate-limited actions
CREATE OR REPLACE FUNCTION public.log_rate_limited_action(p_action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.rate_limit_logs (user_id, action)
  VALUES (auth.uid(), p_action);
  
  -- Clean up old entries (older than 24 hours) to prevent table bloat
  DELETE FROM public.rate_limit_logs
  WHERE created_at < now() - interval '24 hours';
END;
$$;
