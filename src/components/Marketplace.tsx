
import { useState, useEffect } from "react";
import { Filter, Grid, List, Search, Heart, MessageCircle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { format } from "date-fns";
import kemis1 from "@/assets/kemis-1.jpg";

export const Marketplace = () => {
  const { products, loading, fetchProducts, toggleLike } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Items Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
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
              className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors ${
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
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Heart 
                      size={16} 
                      className={product.is_liked ? 'text-red-500 fill-current' : 'text-white'} 
                    />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg leading-tight">{product.title}</h3>
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                </div>
                
                {product.seller && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                      {product.seller.display_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-300">{product.seller.display_name || 'Anonymous'}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                  <span>{product.category}</span>
                  {product.size && <span>Size {product.size}</span>}
                  <span>{product.condition}</span>
                </div>
                
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {product.likes}
                    </span>
                    <span>{product.location}</span>
                    <span>{getTimeAgo(product.created_at)}</span>
                  </div>
                  
                  <button className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                    <MessageCircle size={16} />
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
