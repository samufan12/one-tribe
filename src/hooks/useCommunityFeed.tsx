import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { z } from "zod";
import { sanitizeString } from "@/lib/sanitize";

export type PostType =
  | "seller_spotlight"
  | "product_story"
  | "cultural_context"
  | "community_pick"
  | "new_arrival";

export interface CommunityPost {
  id: string;
  user_id: string;
  product_id: string | null;
  caption: string | null;
  likes_count: number;
  views_count: number;
  created_at: string;
  author_display_name: string | null;
  author_avatar_url: string | null;
  product_title: string | null;
  product_price: number | null;
  product_images: string[] | null;
  product_category: string | null;
  product_condition: string | null;
  product_size: string | null;
  comment_count: number;
  isLiked: boolean;
  post_type: PostType;
  cultural_category: string | null;
  origin_city: string | null;
  author_business_name: string | null;
  author_verification_status: string | null;
}

export interface CreatePostInput {
  postType: Exclude<PostType, "new_arrival">;
  caption: string;
  productId?: string | null;
  culturalCategory?: string | null;
  originCity?: string | null;
}

export const useCommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_community_posts");
    if (error || !data) { setLoading(false); return; }

    const postsWithLikes = await Promise.all(
      (data as any[]).map(async (post) => {
        let isLiked = false;
        if (user) {
          const { data: liked } = await supabase.rpc("has_user_liked_community_post", { p_post_id: post.id });
          isLiked = !!liked;
        }
        return { ...post, isLiked } as CommunityPost;
      })
    );
    setPosts(postsWithLikes);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.isLiked) {
      await supabase.from("community_post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("community_post_likes").insert({ post_id: postId, user_id: user.id });
    }

    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes_count: p.isLiked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  };

  const postSchema = z.object({
    postType: z.enum(["seller_spotlight", "product_story", "cultural_context", "community_pick"]),
    caption: z.string().trim().min(3, "Write a little something").max(1000, "Too long"),
    productId: z.string().uuid().nullable().optional(),
    culturalCategory: z.string().trim().max(50).nullable().optional(),
    originCity: z.string().trim().max(100).nullable().optional(),
  });

  const createPost = async (input: CreatePostInput) => {
    if (!user) return false;

    const validation = postSchema.safeParse(input);
    if (!validation.success) return false;
    const v = validation.data;

    // product_story and community_pick require a product
    if ((v.postType === "product_story" || v.postType === "community_pick") && !v.productId) {
      return false;
    }

    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      post_type: v.postType,
      product_id: v.productId ?? null,
      caption: sanitizeString(v.caption),
      cultural_category: v.culturalCategory ? sanitizeString(v.culturalCategory) : null,
      origin_city: v.originCity ? sanitizeString(v.originCity) : null,
    });
    if (error) return false;
    await fetchPosts();
    return true;
  };

  return { posts, loading, toggleLike, createPost, refetch: fetchPosts };
};
