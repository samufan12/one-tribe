
import { useState } from "react";
import { Heart, MessageCircle, Share2, Eye, User, Clock, Tag } from "lucide-react";

type FeedPost = {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  item: {
    name: string;
    price: number;
    images: string[];
    category: string;
    size?: string;
    condition: string;
  };
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
};

const mockPosts: FeedPost[] = [
  {
    id: "1",
    user: {
      name: "Meron Tadesse",
      avatar: "/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png",
      verified: true
    },
    item: {
      name: "Traditional Ethiopian Habesha Kemis",
      price: 240,
      images: ["/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"],
      category: "Traditional Wear",
      size: "M",
      condition: "New with tags"
    },
    caption: "Beautiful handwoven Habesha kemis perfect for special occasions. Made by artisans in Addis Ababa. 💫",
    timestamp: "2h ago",
    likes: 24,
    comments: 8,
    views: 156,
    isLiked: false
  },
  {
    id: "2",
    user: {
      name: "Daniel Berhe",
      avatar: "/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png",
      verified: false
    },
    item: {
      name: "Vintage Ethiopian Coffee Ceremony Set",
      price: 85,
      images: ["/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png"],
      category: "Home & Decor",
      condition: "Excellent"
    },
    caption: "Authentic coffee ceremony set used by my grandmother. Includes jebena, cups, and incense burner.",
    timestamp: "4h ago",
    likes: 18,
    comments: 12,
    views: 89,
    isLiked: true
  }
];

export const CommunityFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Community Feed</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Latest
          </button>
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-accent transition-colors">
            Popular
          </button>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-card rounded-lg border border-border overflow-hidden">
          {/* User Header */}
          <div className="p-4 flex items-center gap-3">
            <img 
              src={post.user.avatar} 
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">{post.user.name}</span>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={12} />
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Item Image */}
          <div className="relative">
            <img 
              src={post.item.images[0]} 
              alt={post.item.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4 bg-foreground/80 text-background px-2 py-1 rounded-md text-sm">
              ${post.item.price}
            </div>
          </div>

          {/* Item Details */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-foreground font-semibold text-lg mb-1">{post.item.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Tag size={14} />
                    <span>{post.item.category}</span>
                  </div>
                  {post.item.size && (
                    <span>Size: {post.item.size}</span>
                  )}
                  <span>{post.item.condition}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{post.caption}</p>

            {/* Engagement Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                  }`}
                >
                  <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle size={20} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye size={16} />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
