import { ArrowRight } from "lucide-react";
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
        action: { label: "Sign In", onClick: () => navigate("/auth") },
      });
      return;
    }
    toggleLike(productId);
  };

  const displayProducts = products.slice(0, 6);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-2xl mb-3" />
                <div className="h-3 bg-secondary rounded w-3/4 mb-1.5" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <button
            onClick={() => navigate(seeMoreHref)}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-1.5 transition-all duration-200 ease-spring"
          >
            See all <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayProducts.map((product) => (
            <button
              key={product.id}
              className="group text-left"
              onClick={() => navigate(`/marketplace`)}
            >
              <div className="aspect-square overflow-hidden rounded-2xl mb-3 bg-secondary">
                <img
                  src={product.images?.[0] || kemis1}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-spring"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide truncate">{product.category}</p>
              <p className="text-sm font-medium text-foreground truncate mt-0.5">{product.title}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">${product.price}</p>
            </button>
          ))}

          {displayProducts.length < 6 && [...Array(6 - displayProducts.length)].map((_, i) => (
            <button
              key={`placeholder-${i}`}
              className="group text-left"
              onClick={() => navigate('/marketplace')}
            >
              <div className="aspect-square overflow-hidden rounded-2xl mb-3 bg-secondary">
                <img
                  src={kemis1}
                  alt="Featured item"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-spring"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Traditional Wear</p>
              <p className="text-sm font-medium text-foreground mt-0.5">Sample Item</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">$99</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
