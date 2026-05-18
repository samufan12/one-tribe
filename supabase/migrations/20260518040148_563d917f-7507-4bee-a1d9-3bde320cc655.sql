DROP FUNCTION IF EXISTS public.get_public_products();
DROP FUNCTION IF EXISTS public.get_public_storefronts();
DROP FUNCTION IF EXISTS public.get_storefront_with_products(uuid);

CREATE OR REPLACE FUNCTION public.get_public_products()
 RETURNS TABLE(
   id uuid, title text, description text, price numeric, category text,
   condition text, size text, location text, images text[],
   likes integer, views integer, created_at timestamp with time zone,
   seller_verification_status text, seller_business_name text
 )
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      p.id, p.title, p.description, p.price, p.category, p.condition,
      p.size, p.location, p.images, p.likes, p.views, p.created_at,
      pr.verification_status, pr.business_name
    FROM public.products p
    LEFT JOIN public.profiles pr ON pr.user_id = p.user_id
    WHERE p.status = 'active';
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_storefronts()
 RETURNS TABLE(
   id uuid, name text, description text, logo_url text, cover_image_url text,
   product_count bigint, created_at timestamp with time zone,
   verification_status text, has_physical_store boolean
 )
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      s.id, s.name, s.description, s.logo_url, s.cover_image_url,
      COUNT(p.id)::bigint AS product_count,
      s.created_at,
      pr.verification_status,
      (pr.business_address IS NOT NULL AND length(trim(pr.business_address)) > 0) AS has_physical_store
    FROM public.storefronts s
    LEFT JOIN public.products p ON p.user_id = s.user_id AND p.status = 'active'
    LEFT JOIN public.profiles pr ON pr.user_id = s.user_id
    WHERE s.is_active = true
    GROUP BY s.id, s.name, s.description, s.logo_url, s.cover_image_url, s.created_at, pr.verification_status, pr.business_address;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_storefront_with_products(p_storefront_id uuid)
 RETURNS TABLE(
   storefront_id uuid, storefront_name text, storefront_description text,
   storefront_logo_url text, storefront_cover_image_url text,
   storefront_created_at timestamp with time zone,
   storefront_verification_status text,
   storefront_business_name text,
   storefront_has_physical_store boolean,
   product_id uuid, product_title text, product_description text,
   product_price numeric, product_category text, product_condition text,
   product_size text, product_location text, product_images text[],
   product_likes integer, product_views integer,
   product_created_at timestamp with time zone
 )
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      s.id, s.name, s.description, s.logo_url, s.cover_image_url, s.created_at,
      pr.verification_status,
      pr.business_name,
      (pr.business_address IS NOT NULL AND length(trim(pr.business_address)) > 0) AS has_physical_store,
      p.id, p.title, p.description, p.price, p.category, p.condition,
      p.size, p.location, p.images, p.likes, p.views, p.created_at
    FROM public.storefronts s
    LEFT JOIN public.profiles pr ON pr.user_id = s.user_id
    LEFT JOIN public.products p ON p.user_id = s.user_id AND p.status = 'active'
    WHERE s.id = p_storefront_id AND s.is_active = true;
END;
$function$;