import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, MapPin, Clock, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GrailedLayout from "@/components/GrailedLayout";
import { useProducts, Product } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, toggleLike } = useProducts();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (products.length > 0 && id) {
      const found = products.find(p => p.id === id);
      setProduct(found || null);
    }
  }, [products, id]);

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

  const handleMessage = () => {
    if (!user) {
      handleAuthRequired("contact sellers");
      return;
    }
    navigate("/messages");
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
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleMessage} className="flex-1" size="lg">
                <MessageCircle size={18} className="mr-2" />
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
      </div>
    </GrailedLayout>
  );
};

export default ProductDetail;
