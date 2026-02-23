import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Eye, Clock, Tag, Plus, Loader2 } from "lucide-react";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MyProduct {
  id: string;
  title: string;
  price: number;
  images: string[] | null;
}

const CreatePostDialog = ({ onCreated }: { onCreated: () => void }) => {
  const { createPost } = useCommunityFeed();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's own products when dialog opens
  useEffect(() => {
    if (!open || !user) return;
    setLoadingProducts(true);
    supabase
      .from("products")
      .select("id, title, price, images")
      .eq("user_id", user.id)
      .eq("status", "active")
      .then(({ data }) => {
        setMyProducts(data || []);
        setLoadingProducts(false);
      });
  }, [open, user]);

  const handleSubmit = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    setSubmitting(true);
    const success = await createPost(selectedProductId, caption);
    setSubmitting(false);
    if (success) {
      toast.success("Post created!");
      setCaption("");
      setSelectedProductId(null);
      setOpen(false);
      onCreated();
    } else {
      toast.error("Failed to create post. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus size={16} />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share a Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {loadingProducts ? (
            <div className="py-4 text-center text-muted-foreground">Loading your products…</div>
          ) : myProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              You don't have any listed products yet. List a product first to share it with the community.
            </p>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select a product</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {myProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-colors text-left ${
                        selectedProductId === product.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-12 h-12 rounded-md object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground">${product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Caption (optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell the community about this item…"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <Button onClick={handleSubmit} disabled={!selectedProductId || submitting} className="w-full">
                {submitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                Share to Community
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CommunityFeed = () => {
  const { user } = useAuth();
  const { posts, loading, toggleLike, refetch } = useCommunityFeed();

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
        <div className="flex gap-2 items-center">
          <CreatePostDialog onCreated={refetch} />
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
