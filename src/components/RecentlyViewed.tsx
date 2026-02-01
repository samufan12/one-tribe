import { useNavigate } from "react-router-dom";
import { Clock, X } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like new":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">Recently Viewed</h2>
          </div>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {recentlyViewed.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group bg-background rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all text-left"
            >
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${getConditionColor(product.condition)}`}
                >
                  {product.condition}
                </span>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-foreground line-clamp-1">{product.title}</p>
                <p className="font-bold text-sm text-foreground">${product.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
