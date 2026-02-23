import { Heart, MessageCircle, Share2, Eye, Clock, Tag } from "lucide-react";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export const CommunityFeed = () => {
  const { user } = useAuth();
  const { posts, loading, toggleLike } = useCommunityFeed();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-muted-foreground">
        Loading community feed…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Community Feed</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Latest
          </button>
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-accent transition-colors">
            Popular
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>No posts in the community yet.</p>
          <p className="text-sm mt-2">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* User Header */}
            <div className="p-4 flex items-center gap-3">
              <img
                src={post.author_avatar_url || "/placeholder.svg"}
                alt={post.author_display_name || "User"}
                className="w-10 h-10 rounded-full object-cover bg-muted"
              />
              <div className="flex-1">
                <span className="text-foreground font-medium">
                  {post.author_display_name || "Anonymous"}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={12} />
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Product Image */}
            {post.product_images && post.product_images.length > 0 && (
              <div className="relative">
                <img
                  src={post.product_images[0]}
                  alt={post.product_title || "Product"}
                  className="w-full h-96 object-cover"
                />
                {post.product_price != null && (
                  <div className="absolute top-4 right-4 bg-foreground/80 text-background px-2 py-1 rounded-md text-sm">
                    ${post.product_price}
                  </div>
                )}
              </div>
            )}

            {/* Item Details */}
            <div className="p-4">
              {post.product_title && (
                <div className="mb-3">
                  <h3 className="text-foreground font-semibold text-lg mb-1">{post.product_title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {post.product_category && (
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{post.product_category}</span>
                      </div>
                    )}
                    {post.product_size && <span>Size: {post.product_size}</span>}
                    {post.product_condition && <span>{post.product_condition}</span>}
                  </div>
                </div>
              )}

              {post.caption && <p className="text-muted-foreground mb-4">{post.caption}</p>}

              {/* Engagement Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => user && toggleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!user}
                  >
                    <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                    <span>{post.likes_count}</span>
                  </button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle size={20} />
                    <span>{post.comment_count}</span>
                  </div>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye size={16} />
                  <span>{post.views_count}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
