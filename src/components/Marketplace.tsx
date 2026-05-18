import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { featureFlags } from "@/config/featureFlags";
import { format } from "date-fns";
import kemis1 from "@/assets/kemis-1.jpg";
import { ProductSkeletonGrid } from "./ProductSkeleton";
import { toast } from "sonner";
import { VerifiedBadge } from "./VerifiedBadge";

export const Marketplace = () => {
  const { products, loading, fetchProducts, toggleLike } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const handleAuthRequired = (action: string) => {
    toast.error(`Please sign in to ${action}`, {
      action: { label: "Sign In", onClick: () => navigate("/auth") },
    });
  };

  const handleLike = (productId: string) => {
    if (!user) { handleAuthRequired("save items"); return; }
    toggleLike(productId);
  };

  const allCats = ["All", "Men", "Women", "Kemis & Zuria", "Netela & Gabi", "Home & Decor", "Jewelry", "Coffee & Spices"];
  const categories = allCats.filter((c) => {
    if (c === "Home & Decor" && !featureFlags.showCategoryHomeDecor) return false;
    if (c === "Jewelry" && !featureFlags.showCategoryJewelry) return false;
    if (c === "Men" && !featureFlags.showTraditionalWearMens) return false;
    if (c === "Kemis & Zuria" && !featureFlags.showTraditionalWearKemis) return false;
    return true;
  });

  useEffect(() => {
    const urlSearch = searchParams.get('search') || "";
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProducts(searchTerm, selectedCategory);
      if (searchTerm) setSearchParams({ search: searchTerm });
      else setSearchParams({});
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, selectedCategory]);

  const getTimeAgo = (d: string) => {
    const date = new Date(d); const now = new Date();
    const h = Math.floor((now.getTime() - date.getTime()) / 3.6e6);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h`;
    if (h < 168) return `${Math.floor(h / 24)}d`;
    return format(date, 'MMM d');
  };

  return (
    <div>
      {/* Editorial masthead */}
      <section className="border-b border-border/60">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-16 pb-10">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="text-eyebrow text-muted-foreground mb-3">Vol. 01 — The Marketplace</p>
              <h1
                className="font-semibold tracking-[-0.04em] leading-[0.95]"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                Everything,<br />
                <span className="italic font-light text-muted-foreground">curated.</span>
              </h1>
            </div>
            <div className="hidden md:block max-w-xs text-right">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {loading ? "Loading the collection…" : (
                  <><span className="text-foreground font-medium">{products.length}</span> objects from the diaspora, listed by hand.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-4 flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {/* Categories as editorial tabs */}
          <div className="flex items-center gap-5 shrink-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative text-[13px] tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                  {active && <span className="absolute -bottom-[17px] left-0 right-0 h-px bg-foreground" />}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block h-5 w-px bg-border ml-auto" />

          {/* Search inline */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search the archive"
            className="hidden md:block bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border-b border-transparent focus:border-foreground transition-colors w-48 pb-0.5"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-[13px] text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price ↑</option>
            <option value="price-high">Price ↓</option>
            <option value="popular">Most loved</option>
          </select>
        </div>
      </div>

      {/* Editorial grid */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 py-12">
        {loading ? (
          <ProductSkeletonGrid count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-eyebrow text-muted-foreground mb-3">No results</p>
            <h2 className="text-3xl font-semibold tracking-tight">Nothing matches — yet.</h2>
            <p className="text-muted-foreground mt-3">Try a different category or word.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
            {products.map((product, idx) => {
              // Asymmetric: every 7th item spans 2 columns, taller
              const isFeature = idx % 7 === 3;
              return (
                <article
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className={`group cursor-pointer ${isFeature ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <div className={`relative overflow-hidden bg-secondary ${isFeature ? "aspect-[4/5]" : "aspect-[4/5]"} rounded-sm`}>
                    <img
                      src={product.images?.[0] || kemis1}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-spring group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                    {/* Hover veil with editorial overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(product.id); }}
                      className="absolute top-4 right-4 text-[11px] tracking-wide uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:underline underline-offset-4"
                    >
                      {product.is_liked ? "Saved" : "Save"}
                    </button>
                    <span className="absolute bottom-4 left-4 text-[10px] tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View →
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{product.category}</p>
                        <VerifiedBadge
                          verificationStatus={product.seller_verification_status}
                          businessName={product.seller_business_name}
                        />
                      </div>
                      <h3 className={`text-foreground tracking-tight truncate ${isFeature ? "text-xl font-medium" : "text-[15px] font-normal"}`}>
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {product.location} · {getTimeAgo(product.created_at)}
                      </p>
                    </div>
                    <p className="text-[15px] font-medium tracking-tight text-foreground shrink-0 tabular-nums">
                      ${product.price}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
