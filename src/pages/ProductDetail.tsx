import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, MapPin, Clock, Shield, Truck, CreditCard, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GrailedLayout from "@/components/GrailedLayout";
import { useProducts, Product } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/hooks/useCart";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, toggleLike } = useProducts();
  const { user } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (products.length > 0 && id) {
      const found = products.find(p => p.id === id);
      setProduct(found || null);
      
      // Track in recently viewed
      if (found) {
        addToRecentlyViewed(found);
      }
      
      // Find related products from the same category
      if (found) {
        const related = products
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [products, id, addToRecentlyViewed]);

  const handleAuthRequired = (action: string) => {
    toast.error(`Please sign in to ${action}`, {
      action: {
        label: "Sign In",
        onClick: () => navigate("/auth"),
      },
    });
  };

  const handleLike = () => {
    if (!user) {
      handleAuthRequired("like items");
      return;
    }
    if (product) {
      toggleLike(product.id);
      setProduct(prev => prev ? { ...prev, is_liked: !prev.is_liked, likes: prev.is_liked ? prev.likes - 1 : prev.likes + 1 } : null);
    }
  };

  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessage = async () => {
    if (!user) {
      handleAuthRequired("contact sellers");
      return;
    }
    if (!product || product.id.startsWith("sample-")) {
      toast.error("Messaging is not available for sample products");
      return;
    }

    setIsMessaging(true);
    try {
      // Get the seller's user_id
      const { data: sellerId, error: sellerError } = await supabase.rpc("get_product_seller_id", {
        p_product_id: product.id,
      });
      if (sellerError || !sellerId) throw new Error("Could not find seller");

      if (sellerId === user.id) {
        toast.error("You can't message yourself!");
        return;
      }

      // Get or create conversation
      const { data: conversationId, error: convError } = await supabase.rpc("get_or_create_conversation", {
        p_other_user_id: sellerId,
        p_product_id: product.id,
      });
      if (convError || !conversationId) throw new Error("Could not start conversation");

      navigate(`/messages?conversation=${conversationId}`);
    } catch (error: any) {
      console.error("Message error:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsMessaging(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          productId: product.id,
          productTitle: product.title,
          price: product.price,
          quantity: 1,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return format(date, 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <GrailedLayout showCategoryNav={false}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-muted rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </GrailedLayout>
    );
  }

  if (!product) {
    return (
      <GrailedLayout showCategoryNav={false}>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/marketplace")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </GrailedLayout>
    );
  }

  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=600&fit=crop'];

  return (
    <GrailedLayout showCategoryNav={false}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                      index === currentImageIndex ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Condition */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge className={getConditionColor(product.condition)}>{product.condition}</Badge>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-3xl font-bold text-foreground">${product.price}</p>
              <p className="text-sm text-muted-foreground mt-1">
                + ${(product.price * 0.05).toFixed(2)} platform fee (5%)
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button 
                  onClick={handleBuyNow} 
                  size="lg" 
                  disabled={isCheckingOut}
                  className="flex-1"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      Buy Now · ${(product.price * 1.05).toFixed(2)}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: images[0],
                      category: product.category,
                      condition: product.condition,
                      size: product.size || undefined,
                    });
                    toast.success("Added to cart");
                  }}
                >
                  <ShoppingCart size={18} />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleMessage} variant="outline" className="flex-1" size="lg" disabled={isMessaging}>
                  {isMessaging ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <MessageCircle size={18} className="mr-2" />
                  )}
                  Message Seller
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleLike}
                  className={product.is_liked ? "text-red-500 border-red-500" : ""}
                >
                  <Heart size={18} className={product.is_liked ? "fill-red-500" : ""} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground py-4 border-y border-border">
              <div className="flex items-center gap-2">
                <Heart size={16} />
                <span>{product.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Listed {getTimeAgo(product.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{product.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Size */}
            {product.size && (
              <div>
                <h2 className="font-semibold text-foreground mb-2">Size</h2>
                <Badge variant="outline" className="text-base px-4 py-1">{product.size}</Badge>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="text-primary" size={24} />
                <div>
                  <p className="font-medium text-sm">Buyer Protection</p>
                  <p className="text-xs text-muted-foreground">Money-back guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Truck className="text-primary" size={24} />
                <div>
                  <p className="font-medium text-sm">Secure Shipping</p>
                  <p className="text-xs text-muted-foreground">Tracked delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">More in {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setCurrentImageIndex(0);
                    window.scrollTo(0, 0);
                  }}
                  className="group bg-background rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all text-left"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=300&h=300&fit=crop'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                    <p className="font-bold text-foreground mt-1">${item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GrailedLayout>
  );
};

export default ProductDetail;
