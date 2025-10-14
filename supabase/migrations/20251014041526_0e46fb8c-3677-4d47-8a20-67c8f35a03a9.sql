-- Create usage table for AI assistant rate limiting
CREATE TABLE public.ai_assistant_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_assistant_usage ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert/view their own usage rows
CREATE POLICY "Users can insert their own usage rows"
ON public.ai_assistant_usage
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage rows"
ON public.ai_assistant_usage
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Disallow updates/deletes by users
CREATE POLICY "No updates allowed"
ON public.ai_assistant_usage
FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "No deletes allowed"
ON public.ai_assistant_usage
FOR DELETE TO authenticated
USING (false);

-- Helpful index for rate limit queries
CREATE INDEX idx_ai_usage_user_time
ON public.ai_assistant_usage (user_id, created_at DESC);

-- Create a function to check rate limits
CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id uuid,
  p_window_minutes integer DEFAULT 60,
  p_max_requests integer DEFAULT 20
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count integer;
BEGIN
  -- Count requests within the time window
  SELECT COUNT(*)
  INTO request_count
  FROM public.ai_assistant_usage
  WHERE user_id = p_user_id
    AND created_at > now() - (p_window_minutes || ' minutes')::interval;
  
  -- Return true if under limit, false if over
  RETURN request_count < p_max_requests;
END;
$$;

-- Create a function to log AI usage
CREATE OR REPLACE FUNCTION public.log_ai_usage()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.ai_assistant_usage (user_id)
  VALUES (auth.uid())
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;