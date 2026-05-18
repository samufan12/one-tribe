import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { useCommunityFeed, type PostType, type CommunityPost } from "@/hooks/useCommunityFeed";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { VerifiedBadge } from "./VerifiedBadge";

import coffeeCeremonySet from "@/assets/coffee-ceremony-set.jpg";
import traditionalKemis from "@/assets/traditional-kemis.jpg";
import netelaShawl from "@/assets/netela-shawl.webp";
import berbereSpice from "@/assets/berbere-spice.jpg";
import seller1 from "@/assets/seller-1.jpg";

// ------------------ Post-type config ------------------

type ComposablePostType = Exclude<PostType, "new_arrival">;

const POST_TYPES: Array<{
  type: ComposablePostType;
  label: string;
  prompt: string;
  needsProduct: boolean;
  needsCulturalCategory?: boolean;
  needsOriginCity?: boolean;
}> = [
  { type: "seller_spotlight", label: "Seller spotlight", prompt: "Share your story — where are you from and what do you sell?", needsProduct: false, needsOriginCity: true },
  { type: "product_story", label: "Product story", prompt: "Tell us about this item — what makes it special or unique?", needsProduct: true },
  { type: "cultural_context", label: "Cultural context", prompt: "Share something about Habesha culture, food, or tradition", needsProduct: false, needsCulturalCategory: true },
  { type: "community_pick", label: "Community pick", prompt: "Recommend a listing — why do you love it?", needsProduct: true },
];

const CULTURAL_CATEGORIES = ["Food", "Clothing", "Tradition", "Music"];

const POST_TYPE_LABEL: Record<PostType, string> = {
  seller_spotlight: "Seller spotlight",
  product_story: "Product story",
  cultural_context: "Cultural context",
  community_pick: "Community pick",
  new_arrival: "New arrival",
};

// ------------------ Sample seed posts (shown when feed is empty) ------------------

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: "sample-1",
    user_id: "sample",
    product_id: null,
    caption:
      "I'm Hanna, born in Addis, now sewing in Minneapolis. I make hand-embroidered netelas and zurias using cotton sourced from Shiro Meda. Every piece carries a little of home.",
    likes_count: 84,
    views_count: 412,
    created_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    author_display_name: "Hanna Tesfaye",
    author_avatar_url: seller1,
    product_title: null,
    product_price: null,
    product_images: null,
    product_category: null,
    product_condition: null,
    product_size: null,
    comment_count: 12,
    isLiked: false,
    post_type: "seller_spotlight",
    cultural_category: null,
    origin_city: "Addis Ababa → Minneapolis",
    author_business_name: "Hanna Habesha Wear",
    author_verification_status: "verified",
  },
  {
    id: "sample-2",
    user_id: "sample",
    product_id: null,
    caption:
      "Injera isn't just bread — it's the table itself. Fermented teff batter is poured in a spiral onto the mitad, and within minutes the 'eyes' bubble up. Sharing one injera means sharing a meal, and gursha (feeding each other by hand) is how we show love.",
    likes_count: 156,
    views_count: 980,
    created_at: new Date(Date.now() - 6 * 3600_000).toISOString(),
    author_display_name: "Selam M.",
    author_avatar_url: null,
    product_title: null,
    product_price: null,
    product_images: null,
    product_category: null,
    product_condition: null,
    product_size: null,
    comment_count: 24,
    isLiked: false,
    post_type: "cultural_context",
    cultural_category: "Food",
    origin_city: null,
    author_business_name: null,
    author_verification_status: null,
  },
  {
    id: "sample-3",
    user_id: "sample",
    product_id: null,
    caption:
      "This kemis was woven in Bahir Dar by a women's cooperative my aunt has worked with for 20 years. The tilet (gold border) is hand-embroidered — three days of work for one panel. Wearing it at Meskel feels like wearing my grandmother's prayers.",
    likes_count: 47,
    views_count: 220,
    created_at: new Date(Date.now() - 12 * 3600_000).toISOString(),
    author_display_name: "Mahlet K.",
    author_avatar_url: null,
    product_title: "Traditional Ethiopian Kemis — White with Gold Embroidery",
    product_price: 185,
    product_images: [traditionalKemis],
    product_category: "Kemis & Zuria",
    product_condition: "New",
    product_size: "M",
    comment_count: 8,
    isLiked: false,
    post_type: "product_story",
    cultural_category: null,
    origin_city: null,
    author_business_name: null,
    author_verification_status: "verified",
  },
  {
    id: "sample-4",
    user_id: "sample",
    product_id: null,
    caption:
      "If you've never had a proper jebena buna, this set is the way in. The clay holds heat beautifully and the incense burner makes the whole room smell like home.",
    likes_count: 31,
    views_count: 178,
    created_at: new Date(Date.now() - 22 * 3600_000).toISOString(),
    author_display_name: "Yonas A.",
    author_avatar_url: null,
    product_title: "Ethiopian Coffee Ceremony Set — Complete",
    product_price: 125,
    product_images: [coffeeCeremonySet],
    product_category: "Coffee & Spices",
    product_condition: "New",
    product_size: null,
    comment_count: 5,
    isLiked: false,
    post_type: "community_pick",
    cultural_category: null,
    origin_city: null,
    author_business_name: null,
    author_verification_status: null,
  },
  {
    id: "sample-5",
    user_id: "sample",
    product_id: null,
    caption: null,
    likes_count: 12,
    views_count: 64,
    created_at: new Date(Date.now() - 30 * 3600_000).toISOString(),
    author_display_name: "Berbere & Beyond",
    author_avatar_url: null,
    product_title: "Authentic Berbere Spice Blend — Homemade",
    product_price: 18,
    product_images: [berbereSpice],
    product_category: "Coffee & Spices",
    product_condition: "New",
    product_size: null,
    comment_count: 1,
    isLiked: false,
    post_type: "new_arrival",
    cultural_category: null,
    origin_city: null,
    author_business_name: "Berbere & Beyond",
    author_verification_status: "verified",
  },
];

// ------------------ Composer dialog ------------------

interface MyProduct { id: string; title: string; price: number; images: string[] | null; }

const CreatePostDialog = ({ onCreated }: { onCreated: () => void }) => {
  const { createPost } = useCommunityFeed();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<ComposablePostType>("community_pick");
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [culturalCategory, setCulturalCategory] = useState<string>("Food");
  const [originCity, setOriginCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const config = POST_TYPES.find(p => p.type === postType)!;

  useEffect(() => {
    if (!open || !user) return;
    setLoadingProducts(true);
    supabase.from("products").select("id, title, price, images").eq("user_id", user.id).eq("status", "active")
      .then(({ data }) => { setMyProducts(data || []); setLoadingProducts(false); });
  }, [open, user]);

  const handleSubmit = async () => {
    if (config.needsProduct && !selectedId) return toast.error("Pick a product to attach");
    if (!caption.trim() || caption.trim().length < 3) return toast.error("Write a caption (3+ chars)");

    setSubmitting(true);
    const ok = await createPost({
      postType,
      caption: caption.trim(),
      productId: config.needsProduct ? selectedId : null,
      culturalCategory: config.needsCulturalCategory ? culturalCategory : null,
      originCity: config.needsOriginCity ? (originCity.trim() || null) : null,
    });
    setSubmitting(false);
    if (ok) {
      toast.success("Shared!");
      setCaption(""); setSelectedId(null); setOriginCity("");
      setOpen(false); onCreated();
    } else toast.error("Failed to share.");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-10 px-5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition inline-flex items-center gap-2">
          <Plus size={14} /> Share a story
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight font-semibold">Share to the feed</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-3">
          {/* Post type pills */}
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">What kind of post?</p>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((pt) => (
                <button
                  key={pt.type}
                  onClick={() => setPostType(pt.type)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    postType === pt.type
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural category */}
          {config.needsCulturalCategory && (
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Topic</p>
              <div className="flex gap-2">
                {CULTURAL_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCulturalCategory(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      culturalCategory === c
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Origin city */}
          {config.needsOriginCity && (
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Where are you from?</p>
              <input
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="e.g. Addis Ababa → Washington, DC"
                className="w-full bg-transparent border-b border-border focus:border-foreground transition-colors py-2 text-foreground focus:outline-none"
                maxLength={100}
              />
            </div>
          )}

          {/* Product picker */}
          {config.needsProduct && (
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">Attach a listing</p>
              {loadingProducts ? (
                <div className="py-4 text-center text-muted-foreground text-sm">Loading…</div>
              ) : myProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">You don't have any active listings yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
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
              )}
            </div>
          )}

          {/* Caption */}
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">Your words</p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={config.prompt}
              className="w-full bg-transparent border-b border-border focus:border-foreground transition-colors py-2 text-foreground focus:outline-none resize-none"
              rows={4}
              maxLength={1000}
            />
            <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">{caption.length}/1000</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />} Share
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ------------------ Card renderers ------------------

const PostTypeBadge = ({ type }: { type: PostType }) => (
  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{POST_TYPE_LABEL[type]}</span>
);

const Engagement = ({ post, onLike, canLike }: { post: CommunityPost; onLike: () => void; canLike: boolean }) => (
  <div className="mt-5 flex items-center gap-7 text-[13px] tracking-tight">
    <button
      onClick={onLike}
      disabled={!canLike}
      className={`transition-colors ${post.isLiked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"} ${!canLike ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {post.isLiked ? "♥" : "♡"} {post.likes_count} saved
    </button>
    <span className="text-muted-foreground">{post.comment_count} replies</span>
    <span className="text-muted-foreground ml-auto">{post.views_count} views</span>
  </div>
);

const Timestamp = ({ d }: { d: string }) => (
  <p className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(d), { addSuffix: true })}</p>
);

const SellerSpotlightCard = ({ post, onLike, canLike }: { post: CommunityPost; onLike: () => void; canLike: boolean }) => (
  <article className="border border-border rounded-sm overflow-hidden bg-card">
    <div className="grid grid-cols-1 md:grid-cols-12">
      <div className="md:col-span-5 aspect-square md:aspect-auto bg-secondary overflow-hidden">
        {post.author_avatar_url ? (
          <img src={post.author_avatar_url} alt={post.author_display_name || ""} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl font-light text-foreground/20">
            {(post.author_display_name || "A").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="md:col-span-7 p-6 md:p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <PostTypeBadge type={post.post_type} />
          <Timestamp d={post.created_at} />
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h2 className="text-2xl font-medium tracking-tight">{post.author_display_name || "Anonymous"}</h2>
          <VerifiedBadge
            verificationStatus={post.author_verification_status}
            businessName={post.author_business_name}
          />
        </div>
        {post.origin_city && (
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-4">{post.origin_city}</p>
        )}
        {post.caption && (
          <p className="text-[15px] leading-[1.7] text-foreground/85 font-light">{post.caption}</p>
        )}
        <Engagement post={post} onLike={onLike} canLike={canLike} />
      </div>
    </div>
  </article>
);

const ProductStoryCard = ({ post, onLike, canLike, onOpen }: { post: CommunityPost; onLike: () => void; canLike: boolean; onOpen: () => void }) => (
  <article>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-xs font-medium text-foreground/60">
        {post.author_avatar_url
          ? <img src={post.author_avatar_url} alt="" className="w-full h-full object-cover" />
          : (post.author_display_name || "A").charAt(0).toUpperCase()}
      </div>
      <div className="text-sm">
        <p className="font-medium leading-tight">{post.author_display_name || "Anonymous"}</p>
        <Timestamp d={post.created_at} />
      </div>
      <span className="ml-auto"><PostTypeBadge type={post.post_type} /></span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <button onClick={onOpen} className="block aspect-[4/5] overflow-hidden bg-secondary rounded-sm group">
        {post.product_images?.[0]
          ? <img src={post.product_images[0]} alt={post.product_title || ""} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.04]" />
          : <div className="w-full h-full" />}
      </button>
      <div>
        {post.product_title && (
          <>
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
              {post.product_category}{post.product_size ? ` · Size ${post.product_size}` : ""}
            </p>
            <h2 className="text-xl font-medium tracking-tight">{post.product_title}</h2>
            {post.product_price != null && (
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">${post.product_price}</p>
            )}
          </>
        )}
        {post.caption && (
          <p className="mt-4 text-[15px] leading-[1.7] text-foreground/85 font-light">{post.caption}</p>
        )}
        {post.product_id && (
          <button onClick={onOpen} className="mt-4 text-[11px] tracking-[0.18em] uppercase hover:underline underline-offset-4">
            View listing →
          </button>
        )}
        <Engagement post={post} onLike={onLike} canLike={canLike} />
      </div>
    </div>
  </article>
);

const CulturalContextCard = ({ post, onLike, canLike }: { post: CommunityPost; onLike: () => void; canLike: boolean }) => (
  <article className="border-l-2 border-foreground/60 pl-6 md:pl-8 py-2">
    <div className="flex items-center gap-3 mb-3">
      <PostTypeBadge type={post.post_type} />
      {post.cultural_category && (
        <span className="text-[10px] tracking-[0.18em] uppercase bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
          {post.cultural_category}
        </span>
      )}
      <Timestamp d={post.created_at} />
    </div>
    {post.caption && (
      <p className="text-[19px] leading-[1.7] tracking-tight text-foreground font-light italic">{post.caption}</p>
    )}
    <p className="mt-4 text-sm text-muted-foreground">— {post.author_display_name || "Anonymous"}</p>
    <Engagement post={post} onLike={onLike} canLike={canLike} />
  </article>
);

const CommunityPickCard = ({ post, onLike, canLike, onOpen }: { post: CommunityPost; onLike: () => void; canLike: boolean; onOpen: () => void }) => (
  <article>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-xs font-medium text-foreground/60">
        {(post.author_display_name || "A").charAt(0).toUpperCase()}
      </div>
      <p className="text-sm">
        <span className="font-medium">{post.author_display_name || "Anonymous"}</span>
        <span className="text-muted-foreground"> recommends</span>
      </p>
      <span className="ml-auto"><PostTypeBadge type={post.post_type} /></span>
    </div>

    {post.caption && (
      <p className="text-[15px] leading-[1.7] text-foreground/85 font-light mb-5">"{post.caption}"</p>
    )}

    <button onClick={onOpen} className="w-full flex items-center gap-4 p-3 border border-border rounded-sm hover:border-foreground/40 transition-colors text-left">
      <div className="w-20 h-20 shrink-0 bg-secondary overflow-hidden rounded-sm">
        {post.product_images?.[0]
          ? <img src={post.product_images[0]} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">{post.product_category}</p>
        <p className="text-sm font-medium truncate">{post.product_title}</p>
        {post.product_price != null && (
          <p className="text-sm text-muted-foreground tabular-nums mt-0.5">${post.product_price}</p>
        )}
      </div>
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground shrink-0">View →</span>
    </button>

    <Engagement post={post} onLike={onLike} canLike={canLike} />
  </article>
);

const NewArrivalCard = ({ post, onLike, canLike, onOpen }: { post: CommunityPost; onLike: () => void; canLike: boolean; onOpen: () => void }) => (
  <article className="border border-border rounded-sm p-4 bg-card">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">New from</span>
      <span className="text-sm font-medium">{post.author_business_name || post.author_display_name || "a store"}</span>
      <VerifiedBadge
        verificationStatus={post.author_verification_status}
        businessName={post.author_business_name}
      />
      <span className="ml-auto"><Timestamp d={post.created_at} /></span>
    </div>
    <button onClick={onOpen} className="w-full flex items-center gap-4 text-left group">
      <div className="w-24 h-24 shrink-0 bg-secondary overflow-hidden rounded-sm">
        {post.product_images?.[0]
          ? <img src={post.product_images[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          : <div className="w-full h-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">{post.product_category}</p>
        <p className="text-base font-medium truncate">{post.product_title}</p>
        {post.product_price != null && (
          <p className="text-sm text-muted-foreground tabular-nums mt-0.5">${post.product_price}</p>
        )}
      </div>
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground shrink-0">View →</span>
    </button>
    <Engagement post={post} onLike={onLike} canLike={canLike} />
  </article>
);

// ------------------ Feed ------------------

export const CommunityFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { posts: dbPosts, loading, toggleLike, refetch } = useCommunityFeed();
  const [filter, setFilter] = useState<"latest" | "popular" | PostType>("latest");

  const posts = dbPosts.length > 0 ? dbPosts : SAMPLE_POSTS;

  const filtered = filter === "latest" || filter === "popular"
    ? [...posts].sort((a, b) =>
        filter === "popular"
          ? b.likes_count - a.likes_count
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : posts.filter(p => p.post_type === filter);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground"><Loader2 className="mx-auto animate-spin" /></div>;
  }

  const handleOpenProduct = (post: CommunityPost) => {
    if (post.product_id) navigate(`/product/${post.product_id}`);
  };

  const handleLike = (post: CommunityPost) => {
    if (!user) return toast.error("Sign in to save posts");
    if (post.id.startsWith("sample-")) return toast.message("This is a sample post");
    toggleLike(post.id);
  };

  const renderCard = (post: CommunityPost) => {
    const props = {
      post,
      onLike: () => handleLike(post),
      canLike: !!user,
      onOpen: () => handleOpenProduct(post),
    };
    switch (post.post_type) {
      case "seller_spotlight": return <SellerSpotlightCard {...props} />;
      case "product_story": return <ProductStoryCard {...props} />;
      case "cultural_context": return <CulturalContextCard {...props} />;
      case "community_pick": return <CommunityPickCard {...props} />;
      case "new_arrival": return <NewArrivalCard {...props} />;
      default: return <CommunityPickCard {...props} />;
    }
  };

  const FILTERS: Array<{ key: typeof filter; label: string }> = [
    { key: "latest", label: "Latest" },
    { key: "popular", label: "Popular" },
    { key: "seller_spotlight", label: "Spotlights" },
    { key: "product_story", label: "Stories" },
    { key: "cultural_context", label: "Culture" },
    { key: "community_pick", label: "Picks" },
    { key: "new_arrival", label: "New arrivals" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Editorial masthead */}
      <header className="pb-8 border-b border-border mb-12">
        <p
          className="text-[13px] tracking-[0.18em] text-muted-foreground mb-2"
          lang="am"
          aria-label="Welcome (Amharic)"
        >
          እንኳን ደህና መጡ <span className="text-foreground/40">· Welcome</span>
        </p>
        <p className="text-eyebrow text-muted-foreground mb-3">Vol. 04 — The Feed</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1
            className="font-semibold tracking-[-0.03em] leading-[1]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Voices of the<br />
            <span className="italic font-light text-muted-foreground">tribe.</span>
          </h1>
          <CreatePostDialog onCreated={refetch} />
        </div>
        <div className="mt-8 flex items-center gap-5 text-[13px] overflow-x-auto scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative pb-2 whitespace-nowrap transition-colors ${filter === f.key ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f.label}
              {filter === f.key && <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-foreground" />}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-eyebrow text-muted-foreground mb-3">Quiet</p>
          <h2 className="text-3xl font-semibold tracking-tight">No posts here — be the first.</h2>
        </div>
      ) : (
        <div className="space-y-16">
          {filtered.map((post) => (
            <div key={post.id}>{renderCard(post)}</div>
          ))}
        </div>
      )}
    </div>
  );
};
