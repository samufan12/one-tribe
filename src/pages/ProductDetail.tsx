import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import GrailedLayout from "@/components/GrailedLayout";
import { useProducts, Product } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/hooks/useCart";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, toggleLike } = useProducts();
  const { user } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  useEffect(() => {
    if (products.length > 0 && id) {
      const found = products.find(p => p.id === id);
      setProduct(found || null);
      if (found) {
        addToRecentlyViewed(found);
        setRelated(products.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
      }
    }
  }, [products, id, addToRecentlyViewed]);

  const requireAuth = (action: string) => {
    toast.error(`Please sign in to ${action}`, {
      action: { label: "Sign In", onClick: () => navigate("/auth") },
    });
  };

  const handleLike = () => {
    if (!user) return requireAuth("save items");
    if (product) {
      toggleLike(product.id);
      setProduct(p => p ? { ...p, is_liked: !p.is_liked, likes: p.is_liked ? p.likes - 1 : p.likes + 1 } : null);
    }
  };

  const handleMessage = async () => {
    if (!user) return requireAuth("contact sellers");
    if (!product || product.id.startsWith("sample-")) return toast.error("Messaging unavailable for samples");
    setIsMessaging(true);
    try {
      const { data: sellerId, error: e1 } = await supabase.rpc("get_product_seller_id", { p_product_id: product.id });
      if (e1 || !sellerId) throw new Error();
      if (sellerId === user.id) return toast.error("You can't message yourself!");
      const { data: convId, error: e2 } = await supabase.rpc("get_or_create_conversation", { p_other_user_id: sellerId, p_product_id: product.id });
      if (e2 || !convId) throw new Error();
      navigate(`/messages?conversation=${convId}`);
    } catch {
      toast.error("Failed to start conversation.");
    } finally { setIsMessaging(false); }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!user) {
      toast.error("Please sign in to continue", {
        action: { label: "Sign In", onClick: () => navigate("/auth") },
      });
      navigate("/auth");
      return;
    }
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { productId: product.id, productTitle: product.title, price: product.price, quantity: 1 },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start checkout.");
      setIsCheckingOut(false);
    }
  };

  const handleShare = async () => {
    try { await navigator.share({ title: product?.title, url: window.location.href }); }
    catch { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }
  };

  if (loading) {
    return <GrailedLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div></GrailedLayout>;
  }

  if (!product) {
    return (
      <GrailedLayout>
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-eyebrow text-muted-foreground mb-3">404</p>
          <h1 className="text-4xl font-semibold tracking-tight mb-4">This piece has moved on.</h1>
          <button onClick={() => navigate("/marketplace")} className="text-sm underline underline-offset-4 hover:no-underline">
            Return to the marketplace
          </button>
        </div>
      </GrailedLayout>
    );
  }

  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=1200&h=1200&fit=crop'];

  return (
    <GrailedLayout>
      {/* Editorial breadcrumb */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-8">
        <button onClick={() => navigate(-1)} className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          ← Back to the collection
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery — full bleed feel, vertical thumbnails */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] bg-secondary overflow-hidden rounded-sm">
            <img src={images[imgIdx]} alt={product.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="text-[11px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                  {String(imgIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition text-sm">←</button>
                  <button onClick={() => setImgIdx((imgIdx + 1) % images.length)} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition text-sm">→</button>
                </div>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square overflow-hidden rounded-sm transition-opacity ${i === imgIdx ? "opacity-100 ring-1 ring-foreground" : "opacity-50 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editorial info */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-4">{product.category} · {product.condition}</p>
            <h1
              className="font-semibold tracking-[-0.03em] leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              {product.title}
            </h1>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-medium tracking-tight tabular-nums">${product.price}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBuyNow}
              disabled={isCheckingOut}
              className="w-full h-14 bg-foreground text-background text-sm font-medium tracking-tight rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all duration-200 ease-spring disabled:opacity-60 inline-flex items-center justify-center"
            >
              {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : `Buy now · $${product.price.toFixed(2)}`}
            </button>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => { addItem({ id: product.id, title: product.title, price: product.price, image: images[0], category: product.category, condition: product.condition, size: product.size || undefined }); toast.success("Added to cart"); }}
                className="h-12 border border-border text-sm font-medium rounded-full hover:border-foreground transition-colors"
              >
                Add to cart
              </button>
              <button onClick={handleMessage} disabled={isMessaging} className="h-12 border border-border text-sm font-medium rounded-full hover:border-foreground transition-colors">
                {isMessaging ? "…" : "Message"}
              </button>
              <button onClick={handleLike} className="h-12 border border-border text-sm font-medium rounded-full hover:border-foreground transition-colors">
                {product.is_liked ? "Saved ♥" : "Save"}
              </button>
            </div>
            <button onClick={handleShare} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 underline underline-offset-4">
              Share this piece
            </button>
          </div>

          {/* Editorial details — definition list */}
          <dl className="border-t border-border pt-8 space-y-4">
            {[
              ["Condition", product.condition],
              ...(product.size ? [["Size", product.size]] as [string, string][] : []),
              ["Location", product.location],
              ["Listed", format(new Date(product.created_at), 'MMMM d, yyyy')],
              ["Saved by", `${product.likes} ${product.likes === 1 ? "person" : "people"}`],
            ].map(([k, v]) => (
              <div key={k as string} className="flex items-baseline justify-between gap-6 text-sm border-b border-border/40 pb-3">
                <dt className="text-muted-foreground tracking-tight">{k}</dt>
                <dd className="text-foreground font-medium tracking-tight text-right">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Description as long-form */}
          <div className="border-t border-border pt-8">
            <p className="text-eyebrow text-muted-foreground mb-4">About this piece</p>
            <p className="text-[17px] leading-[1.7] text-foreground/90 font-light">{product.description}</p>
          </div>

          {/* Trust — typographic, no boxes */}
          <div className="border-t border-border pt-8 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-foreground font-medium tracking-tight">Buyer protection</p>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">Money-back guarantee on every order.</p>
            </div>
            <div>
              <p className="text-foreground font-medium tracking-tight">Tracked shipping</p>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">From the seller, to your door.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related — editorial */}
      {related.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 sm:px-10 py-20 border-t border-border">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">More from the {product.category} chapter</h2>
            <button onClick={() => navigate(`/marketplace`)} className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
              See all →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(`/product/${item.id}`); setImgIdx(0); window.scrollTo(0, 0); }}
                className="group text-left"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary rounded-sm">
                  <img src={item.images?.[0] || images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.06]" />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="text-sm tracking-tight truncate">{item.title}</h3>
                  <p className="text-sm font-medium tabular-nums shrink-0">${item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </GrailedLayout>
  );
};

export default ProductDetail;
