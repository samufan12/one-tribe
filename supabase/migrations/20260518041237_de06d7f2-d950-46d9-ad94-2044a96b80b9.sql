-- Add post type and related fields
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'community_pick',
  ADD COLUMN IF NOT EXISTS cultural_category text,
  ADD COLUMN IF NOT EXISTS origin_city text;

-- Enforce allowed post types via validation trigger (not a CHECK to keep flexibility)
CREATE OR REPLACE FUNCTION public.validate_community_post_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.post_type NOT IN ('seller_spotlight','product_story','cultural_context','community_pick','new_arrival') THEN
    RAISE EXCEPTION 'Invalid post_type: %', NEW.post_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_community_post_type_trigger ON public.community_posts;
CREATE TRIGGER validate_community_post_type_trigger
BEFORE INSERT OR UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.validate_community_post_type();

-- Recreate get_community_posts with new fields
DROP FUNCTION IF EXISTS public.get_community_posts();

CREATE OR REPLACE FUNCTION public.get_community_posts()
 RETURNS TABLE(
   id uuid, user_id uuid, product_id uuid, caption text,
   likes_count integer, views_count integer, created_at timestamp with time zone,
   author_display_name text, author_avatar_url text,
   product_title text, product_price numeric, product_images text[],
   product_category text, product_condition text, product_size text,
   comment_count bigint,
   post_type text, cultural_category text, origin_city text,
   author_business_name text, author_verification_status text
 )
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT
      cp.id, cp.user_id, cp.product_id, cp.caption,
      cp.likes_count, cp.views_count, cp.created_at,
      p.display_name, p.avatar_url,
      pr.title, pr.price, pr.images, pr.category, pr.condition, pr.size,
      (SELECT COUNT(*) FROM public.community_comments cc WHERE cc.post_id = cp.id),
      cp.post_type, cp.cultural_category, cp.origin_city,
      p.business_name, p.verification_status
    FROM public.community_posts cp
    LEFT JOIN public.profiles p ON p.user_id = cp.user_id
    LEFT JOIN public.products pr ON pr.id = cp.product_id
    ORDER BY cp.created_at DESC;
END;
$function$;