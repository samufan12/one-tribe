import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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
}

export const useCommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_community_posts");
    if (error || !data) { setLoading(false); return; }

    // Check which posts current user has liked
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

  return { posts, loading, toggleLike, refetch: fetchPosts };
};
