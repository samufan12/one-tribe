import { useState, useEffect } from "react";
import { Filter, Grid, List, Search, Heart, MessageCircle, Lock } from "lucide-react";
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

  const categories = ["All", "Traditional Wear", "Home & Decor", "Jewelry", "Art", "Music"];

  // Fetch products when search term or category changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchTerm, selectedCategory);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? 'Loading...' : `${products.length} items available`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

        {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors flex items-center gap-2 hover:scale-105 active:scale-95">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Items Grid/List */}
      {loading ? (
        <ProductSkeletonGrid count={6} listView={viewMode === 'list'} />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
            <img src={kemis1} alt="No products" className="w-full h-full object-cover opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to list an item in the marketplace!'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-card rounded-lg border overflow-hidden hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                <div className="relative">
                  <img 
                    src={product.images?.[0] || kemis1} 
                    alt={product.title}
                    className={`object-cover ${
                      viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                    }`}
                  />
                  <button 
                    onClick={() => handleLike(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-200 hover:scale-110"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors ${
                        product.is_liked ? 'text-red-500 fill-current' : 'text-white hover:text-red-300'
                      }`} 
                    />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 pr-2">{product.title}</h3>
                  <span className="text-xl font-bold text-primary whitespace-nowrap">${product.price}</span>
                </div>
                
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
                  <span className="bg-accent/30 px-2 py-1 rounded text-xs">{product.category}</span>
                  {product.size && <span className="bg-accent/30 px-2 py-1 rounded text-xs">Size {product.size}</span>}
                  <span className="bg-accent/30 px-2 py-1 rounded text-xs">{product.condition}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <Heart size={14} />
                      {product.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {product.location}
                    </span>
                    <span>{getTimeAgo(product.created_at)}</span>
                  </div>
                  
                  <button 
                    onClick={handleMessage}
                    className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center gap-1"
                    title={user ? "Message seller" : "Sign in to message seller"}
                  >
                    <MessageCircle size={16} />
                    {!user && <Lock size={12} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
