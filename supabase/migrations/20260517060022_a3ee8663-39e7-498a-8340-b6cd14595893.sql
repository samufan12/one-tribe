
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE OR REPLACE FUNCTION public.approve_seller(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can approve sellers';
  END IF;

  UPDATE public.profiles
  SET verification_status = 'verified',
      rejection_reason = NULL,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_seller(p_user_id uuid, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can reject sellers';
  END IF;

  UPDATE public.profiles
  SET verification_status = 'rejected',
      rejection_reason = p_reason,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_profiles()
RETURNS TABLE(
  user_id uuid,
  display_name text,
  business_name text,
  verification_status text,
  stripe_account_id text,
  rejection_reason text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can list profiles';
  END IF;

  RETURN QUERY
    SELECT p.user_id, p.display_name, p.business_name, p.verification_status,
           p.stripe_account_id, p.rejection_reason, p.created_at
    FROM public.profiles p
    ORDER BY p.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_orders()
RETURNS TABLE(
  id uuid,
  created_at timestamptz,
  buyer_id uuid,
  seller_id uuid,
  product_id uuid,
  product_ids text[],
  amount_total integer,
  total numeric,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can list orders';
  END IF;

  RETURN QUERY
    SELECT o.id, o.created_at, o.buyer_id, o.seller_id, o.product_id,
           o.product_ids, o.amount_total, o.total, o.status
    FROM public.orders o
    ORDER BY o.created_at DESC;
END;
$$;
