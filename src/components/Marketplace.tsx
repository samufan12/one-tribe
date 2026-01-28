import { useState, useEffect } from "react";
import { Grid, List, Search, Heart, MessageCircle, Lock, ChevronDown } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import kemis1 from "@/assets/kemis-1.jpg";
import { ProductSkeletonGrid } from "./ProductSkeleton";
import { toast } from "sonner";

export const Marketplace = () => {
  const { products, loading, fetchProducts, toggleLike } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const handleAuthRequired = (action: string) => {
    toast.error(`Please sign in to ${action}`, {
      action: {
        label: "Sign In",
        onClick: () => navigate("/auth"),
      },
    });
  };

  const handleLike = (productId: string) => {
    if (!user) {
      handleAuthRequired("like items");
      return;
    }
    toggleLike(productId);
  };

  const handleMessage = () => {
    if (!user) {
      handleAuthRequired("contact sellers");
      return;
    }
    navigate("/messages");
  };

  const categories = ["All", "Men", "Women", "Kemis & Zuria", "Netela & Gabi", "Home & Decor", "Jewelry", "Coffee & Spices"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchTerm, selectedCategory);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return format(date, 'MMM d');
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Category Chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="pl-9 pr-4 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 w-48"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>
        </div>

        {/* View Mode & Results Count */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${products.length} items`}
          </span>
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-muted'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-muted'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductSkeletonGrid count={12} listView={viewMode === 'list'} />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden">
            <img src={kemis1} alt="No products" className="w-full h-full object-cover opacity-50" />
          </div>
          <p className="text-muted-foreground text-lg">No items found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className={`group bg-background rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all cursor-pointer ${
                viewMode === 'list' ? 'flex gap-4' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden bg-muted ${
                viewMode === 'list' ? 'w-40 h-40 shrink-0' : 'aspect-square'
              }`}>
                <img
                  src={product.images?.[0] || kemis1}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Like Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLike(product.id); }}
                  className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                >
                  <Heart 
                    size={16} 
                    className={product.is_liked ? "fill-red-500 text-red-500" : "text-foreground"} 
                  />
                </button>

                {/* Condition Badge */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${getConditionColor(product.condition)}`}>
                  {product.condition}
                </span>
              </div>

              {/* Info */}
              <div className="p-3 flex-1">
                <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">${product.price}</p>
                  <button 
                    onClick={handleMessage}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors relative"
                    title={user ? "Message seller" : "Sign in to message"}
                  >
                    <MessageCircle size={16} />
                    {!user && <Lock size={10} className="absolute -bottom-0.5 -right-0.5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {product.location} · {getTimeAgo(product.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
