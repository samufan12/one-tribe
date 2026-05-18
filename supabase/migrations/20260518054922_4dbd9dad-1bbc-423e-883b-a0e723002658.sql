CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'landing_page',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to join the waitlist
CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view the waitlist
CREATE POLICY "Admins can view waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE INDEX idx_waitlist_email ON public.waitlist(email);