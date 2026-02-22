
-- Create storefronts table
CREATE TABLE public.storefronts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  logo_url text,
  cover_image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.storefronts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active storefronts"
ON public.storefronts FOR SELECT
USING (is_active = true);

CREATE POLICY "Sellers can create their own storefront"
ON public.storefronts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'seller'));

CREATE POLICY "Owners can update their storefront"
ON public.storefronts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their storefront"
ON public.storefronts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_storefronts_updated_at
BEFORE UPDATE ON public.storefronts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Security definer function: get public storefronts with product count
CREATE OR REPLACE FUNCTION public.get_public_storefronts()
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  logo_url text,
  cover_image_url text,
  product_count bigint,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
    SELECT
      s.id,
      s.name,
      s.description,
      s.logo_url,
      s.cover_image_url,
      COUNT(p.id)::bigint AS product_count,
      s.created_at
    FROM public.storefronts s
    LEFT JOIN public.products p ON p.user_id = s.user_id AND p.status = 'active'
    WHERE s.is_active = true
    GROUP BY s.id, s.name, s.description, s.logo_url, s.cover_image_url, s.created_at;
END;
$$;

-- Security definer function: get storefront detail with products
CREATE OR REPLACE FUNCTION public.get_storefront_with_products(p_storefront_id uuid)
RETURNS TABLE(
  storefront_id uuid,
  storefront_name text,
  storefront_description text,
  storefront_logo_url text,
  storefront_cover_image_url text,
  storefront_created_at timestamp with time zone,
  product_id uuid,
  product_title text,
  product_description text,
  product_price numeric,
  product_category text,
  product_condition text,
  product_size text,
  product_location text,
  product_images text[],
  product_likes integer,
  product_views integer,
  product_created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
    SELECT
      s.id,
      s.name,
      s.description,
      s.logo_url,
      s.cover_image_url,
      s.created_at,
      p.id,
      p.title,
      p.description,
      p.price,
      p.category,
      p.condition,
      p.size,
      p.location,
      p.images,
      p.likes,
      p.views,
      p.created_at
    FROM public.storefronts s
    LEFT JOIN public.products p ON p.user_id = s.user_id AND p.status = 'active'
    WHERE s.id = p_storefront_id AND s.is_active = true;
END;
$$;
