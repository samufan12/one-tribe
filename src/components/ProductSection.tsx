import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import kemis1 from "@/assets/kemis-1.jpg";

interface ProductSectionProps {
  title: string;
  seeMoreHref?: string;
  chapter?: string;
  intro?: string;
}

const ProductSection = ({ title, seeMoreHref = "/marketplace", chapter, intro }: ProductSectionProps) => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const displayProducts = products.slice(0, 6);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary rounded-sm mb-3" />
                <div className="h-3 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            {chapter && <p className="text-eyebrow text-muted-foreground mb-3">{chapter}</p>}
            <h2
              className="font-semibold tracking-[-0.03em] leading-[1]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              {title}
            </h2>
            {intro && <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{intro}</p>}
          </div>
          <button
            onClick={() => navigate(seeMoreHref)}
            className="text-[11px] tracking-[0.18em] uppercase text-foreground hover:underline underline-offset-4 shrink-0"
          >
            See all →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-12">
          {displayProducts.map((product) => (
            <button
              key={product.id}
              className="group text-left"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm mb-4 bg-secondary">
                <img
                  src={product.images?.[0] || kemis1}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground truncate">{product.category}</p>
              <p className="text-sm font-normal tracking-tight text-foreground truncate mt-1.5">{product.title}</p>
              <p className="text-sm font-medium tabular-nums tracking-tight mt-1">${product.price}</p>
            </button>
          ))}

          {displayProducts.length < 6 && [...Array(6 - displayProducts.length)].map((_, i) => (
            <button
              key={`ph-${i}`}
              className="group text-left"
              onClick={() => navigate('/marketplace')}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm mb-4 bg-secondary">
                <img src={kemis1} alt="" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.06]" loading="lazy" />
              </div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Traditional wear</p>
              <p className="text-sm tracking-tight mt-1.5">Sample piece</p>
              <p className="text-sm font-medium tabular-nums mt-1">$99</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
