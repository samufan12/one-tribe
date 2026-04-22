import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface MyProduct { id: string; title: string; price: number; images: string[] | null; }

const CreatePostDialog = ({ onCreated }: { onCreated: () => void }) => {
  const { createPost } = useCommunityFeed();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setLoadingProducts(true);
    supabase.from("products").select("id, title, price, images").eq("user_id", user.id).eq("status", "active")
      .then(({ data }) => { setMyProducts(data || []); setLoadingProducts(false); });
  }, [open, user]);

  const handleSubmit = async () => {
    if (!selectedId) return toast.error("Pick a product");
    setSubmitting(true);
    const ok = await createPost(selectedId, caption);
    setSubmitting(false);
    if (ok) { toast.success("Shared!"); setCaption(""); setSelectedId(null); setOpen(false); onCreated(); }
    else toast.error("Failed to share.");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-10 px-5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition inline-flex items-center gap-2">
          <Plus size={14} /> Share a piece
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-2xl tracking-tight font-semibold">Share to the feed</DialogTitle></DialogHeader>
        <div className="space-y-5 pt-3">
          {loadingProducts ? (
            <div className="py-6 text-center text-muted-foreground text-sm">Loading…</div>
          ) : myProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">List a product first to share it here.</p>
          ) : (
            <>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">Pick one</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {myProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-sm transition-colors text-left ${selectedId === p.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
                    >
                      <img src={p.images?.[0] || "/placeholder.svg"} alt={p.title} className="w-14 h-14 object-cover bg-muted rounded-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">${p.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Caption</p>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell the tribe about it…"
                  className="w-full bg-transparent border-b border-border focus:border-foreground transition-colors py-2 text-foreground focus:outline-none resize-none"
                  rows={2} maxLength={500}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedId || submitting}
                className="w-full h-12 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />} Share
              </button>
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
  const [filter, setFilter] = useState<'latest' | 'popular'>('latest');

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground"><Loader2 className="mx-auto animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Editorial masthead */}
      <header className="pb-8 border-b border-border mb-12">
        <p className="text-eyebrow text-muted-foreground mb-3">Vol. 04 — The Feed</p>
        <div className="flex items-end justify-between gap-6">
          <h1
            className="font-semibold tracking-[-0.03em] leading-[1]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Voices of the<br />
            <span className="italic font-light text-muted-foreground">tribe.</span>
          </h1>
          <CreatePostDialog onCreated={refetch} />
        </div>
        <div className="mt-8 flex items-center gap-6 text-[13px]">
          {(['latest','popular'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative pb-2 capitalize transition-colors ${filter === f ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
              {filter === f && <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-foreground" />}
            </button>
          ))}
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-eyebrow text-muted-foreground mb-3">Quiet</p>
          <h2 className="text-3xl font-semibold tracking-tight">No stories yet — be the first to write one.</h2>
        </div>
      ) : (
        <div className="space-y-20">
          {posts.map((post, i) => (
            <article key={post.id}>
              {/* Author row */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden">
                  {post.author_avatar_url ? (
                    <img src={post.author_avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-foreground/60">
                      {(post.author_display_name || "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-foreground font-medium tracking-tight leading-tight">{post.author_display_name || "Anonymous"}</p>
                  <p className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                </div>
                <span className="ml-auto text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Nº {String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Image — full bleed feel */}
              {post.product_images && post.product_images.length > 0 && (
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-sm group">
                  <img src={post.product_images[0]} alt={post.product_title || ""} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.04]" />
                  {post.product_price != null && (
                    <span className="absolute top-5 right-5 text-[11px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full tabular-nums">
                      ${post.product_price}
                    </span>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="mt-6">
                {post.product_title && (
                  <>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
                      {post.product_category}{post.product_size ? ` · Size ${post.product_size}` : ""}{post.product_condition ? ` · ${post.product_condition}` : ""}
                    </p>
                    <h2 className="text-2xl font-medium tracking-tight">{post.product_title}</h2>
                  </>
                )}
                {post.caption && (
                  <p className="mt-4 text-[17px] leading-[1.7] text-foreground/85 font-light">{post.caption}</p>
                )}

                {/* Engagement — typographic */}
                <div className="mt-6 flex items-center gap-7 text-[13px] tracking-tight">
                  <button
                    onClick={() => user && toggleLike(post.id)}
                    disabled={!user}
                    className={`transition-colors ${post.isLiked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"} ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {post.isLiked ? "♥" : "♡"} {post.likes_count} saved
                  </button>
                  <span className="text-muted-foreground">{post.comment_count} replies</span>
                  <span className="text-muted-foreground ml-auto">{post.views_count} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
