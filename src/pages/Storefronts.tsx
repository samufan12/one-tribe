import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Storefront {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  product_count: number;
  created_at: string;
}

const Storefronts = () => {
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.rpc("get_public_storefronts").then(({ data, error }) => {
      if (!error && data) setStorefronts(data as Storefront[]);
      setLoading(false);
    });
  }, []);

  return (
    <GrailedLayout>
      {/* Masthead */}
      <section className="border-b border-border/60">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-16 pb-12">
          <p className="text-eyebrow text-muted-foreground mb-3">Vol. 02 — The Houses</p>
          <h1
            className="font-semibold tracking-[-0.04em] leading-[0.95] max-w-4xl"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            Independent <span className="italic font-light text-muted-foreground">houses</span>, one tribe.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
            Branded shops from sellers across the diaspora. Each house tells a different story.
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}
          </div>
        ) : storefronts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-eyebrow text-muted-foreground mb-3">Coming soon</p>
            <h2 className="text-3xl font-semibold tracking-tight">The first houses are opening their doors.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {storefronts.map((sf, i) => (
              <article
                key={sf.id}
                onClick={() => navigate(`/storefront/${sf.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-sm">
                  {sf.cover_image_url ? (
                    <img
                      src={sf.cover_image_url}
                      alt={sf.name}
                      className="w-full h-full object-cover transition-transform duration-[1.4s] ease-spring group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <span className="text-7xl font-light tracking-tighter text-foreground/20">
                        {sf.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  <div className="absolute top-5 left-5 text-[10px] tracking-[0.2em] uppercase text-white/80">
                    Nº {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-2xl font-medium tracking-tight">{sf.name}</h3>
                    <p className="text-xs text-white/70 mt-1">
                      {sf.product_count} {sf.product_count === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                </div>
                {sf.description && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-md">
                    {sf.description}
                  </p>
                )}
                <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-foreground group-hover:underline underline-offset-4">
                  Visit the house →
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </GrailedLayout>
  );
};

export default Storefronts;
