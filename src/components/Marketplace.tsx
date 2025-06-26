
import { useState } from "react";
import { Filter, Grid, List, Search, Heart, MessageCircle } from "lucide-react";

type MarketplaceItem = {
  id: string;
  name: string;
  price: number;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  category: string;
  size?: string;
  condition: string;
  description: string;
  likes: number;
  isLiked: boolean;
  location: string;
  postedAt: string;
};

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "Traditional Ethiopian Habesha Kemis",
    price: 240,
    images: ["/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"],
    seller: {
      name: "Meron Tadesse",
      avatar: "/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png",
      rating: 4.9
    },
    category: "Traditional Wear",
    size: "M",
    condition: "New with tags",
    description: "Beautiful handwoven Habesha kemis perfect for special occasions. Made by artisans in Addis Ababa.",
    likes: 24,
    isLiked: false,
    location: "Washington, DC",
    postedAt: "2 days ago"
  },
  {
    id: "2",
    name: "Vintage Eritrean Traditional Dress",
    price: 180,
    images: ["/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png"],
    seller: {
      name: "Sara Ghebrehiwet",
      avatar: "/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png",
      rating: 4.7
    },
    category: "Traditional Wear",
    size: "S",
    condition: "Excellent",
    description: "Authentic Eritrean traditional dress from the 1990s. Perfect for cultural events.",
    likes: 18,
    isLiked: true,
    location: "Seattle, WA",
    postedAt: "1 week ago"
  },
  {
    id: "3",
    name: "Ethiopian Coffee Ceremony Set",
    price: 85,
    images: ["/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png"],
    seller: {
      name: "Daniel Berhe",
      avatar: "/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png",
      rating: 4.8
    },
    category: "Home & Decor",
    condition: "Very Good",
    description: "Complete coffee ceremony set including jebena, cups, and incense burner.",
    likes: 12,
    isLiked: false,
    location: "Los Angeles, CA",
    postedAt: "3 days ago"
  }
];

export const Marketplace = () => {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Traditional Wear", "Home & Decor", "Jewelry", "Art", "Music"];

  const toggleLike = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
              <div className="relative">
                <img 
                  src={item.images[0]} 
                  alt={item.name}
                  className={`object-cover ${
                    viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                  }`}
                />
                <button 
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Heart 
                    size={16} 
                    className={item.isLiked ? 'text-red-500 fill-current' : 'text-white'} 
                  />
                </button>
              </div>
            </div>
            
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-semibold text-lg leading-tight">{item.name}</h3>
                <span className="text-xl font-bold text-primary">${item.price}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={item.seller.avatar} 
                  alt={item.seller.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-300">{item.seller.name}</span>
                <span className="text-xs text-gray-500">⭐ {item.seller.rating}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                <span>{item.category}</span>
                {item.size && <span>Size {item.size}</span>}
                <span>{item.condition}</span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {item.likes}
                  </span>
                  <span>{item.location}</span>
                  <span>{item.postedAt}</span>
                </div>
                
                <button className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
