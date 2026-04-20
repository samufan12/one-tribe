import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Recently viewed
          </h2>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {recentlyViewed.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group text-left"
            >
              <div className="relative aspect-square bg-secondary overflow-hidden rounded-2xl mb-2">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-spring"
                  loading="lazy"
                />
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-1">{product.title}</p>
              <p className="font-semibold text-sm text-foreground mt-0.5">${product.price}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
