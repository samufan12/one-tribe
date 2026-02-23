
-- =============================================
-- 1. CONVERSATIONS TABLE
-- =============================================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 uuid NOT NULL,
  participant_2 uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Helper function to check conversation membership (used in RLS)
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = _conversation_id
      AND (participant_1 = _user_id OR participant_2 = _user_id)
  );
$$;

CREATE POLICY "Participants can view their conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Authenticated users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Trigger for updated_at
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 2. MESSAGES TABLE
-- =============================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  offer_amount numeric,
  offer_item_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT
TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND public.is_conversation_participant(auth.uid(), conversation_id)
);

-- =============================================
-- 3. COMMUNITY POSTS TABLE
-- =============================================
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  caption text,
  likes_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
ON public.community_posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON public.community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their posts"
ON public.community_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- 4. COMMUNITY POST LIKES TABLE
-- =============================================
CREATE TABLE public.community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post likes"
ON public.community_post_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like posts"
ON public.community_post_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.community_post_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update likes_count on community_posts
CREATE OR REPLACE FUNCTION public.update_community_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_community_likes_count
AFTER INSERT OR DELETE ON public.community_post_likes
FOR EACH ROW EXECUTE FUNCTION public.update_community_post_likes_count();

-- =============================================
-- 5. COMMUNITY COMMENTS TABLE
-- =============================================
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
ON public.community_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can comment"
ON public.community_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.community_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.community_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- 6. CART ITEMS TABLE
-- =============================================
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart"
ON public.cart_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their cart"
ON public.cart_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart items"
ON public.cart_items FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their cart"
ON public.cart_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- 7. SECURITY DEFINER FUNCTIONS
-- =============================================

-- Get or create a conversation between two users about a product
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_other_user_id uuid,
  p_product_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id uuid;
  v_current_user uuid := auth.uid();
BEGIN
  IF v_current_user IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Look for existing conversation between these two users about this product
  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE (
    (participant_1 = v_current_user AND participant_2 = p_other_user_id)
    OR (participant_1 = p_other_user_id AND participant_2 = v_current_user)
  )
  AND (product_id = p_product_id OR (product_id IS NULL AND p_product_id IS NULL))
  LIMIT 1;

  -- If not found, create one
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant_1, participant_2, product_id)
    VALUES (v_current_user, p_other_user_id, p_product_id)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$;

-- Get community posts with author info (security definer to access profiles)
CREATE OR REPLACE FUNCTION public.get_community_posts()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  product_id uuid,
  caption text,
  likes_count integer,
  views_count integer,
  created_at timestamptz,
  author_display_name text,
  author_avatar_url text,
  product_title text,
  product_price numeric,
  product_images text[],
  product_category text,
  product_condition text,
  product_size text,
  comment_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      cp.id,
      cp.user_id,
      cp.product_id,
      cp.caption,
      cp.likes_count,
      cp.views_count,
      cp.created_at,
      p.display_name,
      p.avatar_url,
      pr.title,
      pr.price,
      pr.images,
      pr.category,
      pr.condition,
      pr.size,
      (SELECT COUNT(*) FROM public.community_comments cc WHERE cc.post_id = cp.id)
    FROM public.community_posts cp
    LEFT JOIN public.profiles p ON p.user_id = cp.user_id
    LEFT JOIN public.products pr ON pr.id = cp.product_id
    ORDER BY cp.created_at DESC;
END;
$$;

-- Check if current user has liked a community post
CREATE OR REPLACE FUNCTION public.has_user_liked_community_post(p_post_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_post_likes
    WHERE post_id = p_post_id AND user_id = auth.uid()
  );
$$;

-- Get conversations with last message and other participant info
CREATE OR REPLACE FUNCTION public.get_user_conversations()
RETURNS TABLE(
  conversation_id uuid,
  other_user_id uuid,
  other_display_name text,
  other_avatar_url text,
  product_id uuid,
  last_message_content text,
  last_message_time timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_user uuid := auth.uid();
BEGIN
  RETURN QUERY
    SELECT
      c.id AS conversation_id,
      CASE WHEN c.participant_1 = v_current_user THEN c.participant_2 ELSE c.participant_1 END AS other_user_id,
      prof.display_name AS other_display_name,
      prof.avatar_url AS other_avatar_url,
      c.product_id,
      lm.content AS last_message_content,
      lm.created_at AS last_message_time,
      c.created_at
    FROM public.conversations c
    LEFT JOIN public.profiles prof ON prof.user_id = 
      CASE WHEN c.participant_1 = v_current_user THEN c.participant_2 ELSE c.participant_1 END
    LEFT JOIN LATERAL (
      SELECT m.content, m.created_at
      FROM public.messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) lm ON true
    WHERE c.participant_1 = v_current_user OR c.participant_2 = v_current_user
    ORDER BY COALESCE(lm.created_at, c.created_at) DESC;
END;
$$;
