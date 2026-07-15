import { useNavigate } from "react-router-dom";

export interface CompactProduct {
  id: string;
  title: string;
  price: number;
  condition: string;
  images?: string[] | null;
}

const conditionLabel = (raw: string) => {
  const c = (raw || "").toLowerCase();
  if (c === "new") return "New";
  if (c === "handmade") return "Handmade";
  if (!c) return "Used";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const conditionColor = (raw: string) => {
  const c = (raw || "").toLowerCase();
  if (c === "new") return "bg-green-500/15 text-green-700 dark:text-green-300";
  if (c === "handmade") return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return "bg-muted text-muted-foreground";
};

const CompactProductCard = ({ product }: { product: CompactProduct }) => {
  const navigate = useNavigate();
  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=800&fit=crop";

  return (
    <button
      onClick={() => {
        navigate(`/product/${product.id}`);
        window.scrollTo(0, 0);
      }}
      className="group text-left shrink-0 w-[200px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-sm">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.04]"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full ${conditionColor(
            product.condition
          )}`}
        >
          {conditionLabel(product.condition)}
        </span>
      </div>
      <div className="mt-2.5 space-y-1">
        <h3 className="text-sm leading-snug tracking-tight line-clamp-2 text-foreground">
          {product.title}
        </h3>
        <p className="text-sm font-semibold tabular-nums">${product.price}</p>
      </div>
    </button>
  );
};

export default CompactProductCard;
