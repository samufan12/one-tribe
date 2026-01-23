import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import kemis1 from "@/assets/kemis-1.jpg";

interface ProductSectionProps {
  title: string;
  seeMoreHref?: string;
}

const ProductSection = ({ title, seeMoreHref = "/marketplace" }: ProductSectionProps) => {
  const navigate = useNavigate();
  const { products, loading, toggleLike } = useProducts();
  const { user } = useAuth();

  const handleLike = (productId: string) => {
    if (!user) {
      toast.error("Please sign in to like items", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }
    toggleLike(productId);
  };

  const displayProducts = products.slice(0, 6);

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-md mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={() => navigate(seeMoreHref)}
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
          >
            SEE MORE <ChevronRight size={16} />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => navigate(`/marketplace`)}
            >
              <div className="aspect-square overflow-hidden rounded-md mb-2 bg-muted">
                <img
                  src={product.images?.[0] || kemis1}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm text-muted-foreground truncate">{product.category}</p>
              <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
              <p className="text-sm font-bold text-foreground">${product.price}</p>
            </div>
          ))}
          
          {/* Fill with placeholders if not enough products */}
          {displayProducts.length < 6 && [...Array(6 - displayProducts.length)].map((_, i) => (
            <div 
              key={`placeholder-${i}`} 
              className="group cursor-pointer"
              onClick={() => navigate('/marketplace')}
            >
              <div className="aspect-square overflow-hidden rounded-md mb-2 bg-muted">
                <img
                  src={kemis1}
                  alt="Featured item"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm text-muted-foreground">Traditional Wear</p>
              <p className="text-sm font-medium text-foreground">Sample Item</p>
              <p className="text-sm font-bold text-foreground">$99</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
