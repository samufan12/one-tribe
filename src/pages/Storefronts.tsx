import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Store, Package } from "lucide-react";
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
    const fetch = async () => {
      const { data, error } = await supabase.rpc("get_public_storefronts");
      if (!error && data) setStorefronts(data as Storefront[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Store className="text-primary" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Storefronts</h1>
            <p className="text-muted-foreground text-sm">Discover shops from sellers on OneTribe</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : storefronts.length === 0 ? (
          <div className="text-center py-16">
            <Store size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No storefronts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storefronts.map((sf) => (
              <div
                key={sf.id}
                onClick={() => navigate(`/storefront/${sf.id}`)}
                className="group bg-background rounded-lg border border-border hover:border-foreground/20 overflow-hidden cursor-pointer transition-all hover:shadow-md"
              >
                {/* Cover */}
                <div className="h-32 bg-muted overflow-hidden">
                  {sf.cover_image_url ? (
                    <img src={sf.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store size={32} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 -mt-8 relative">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-full border-2 border-background bg-muted overflow-hidden mb-3">
                    {sf.logo_url ? (
                      <img src={sf.logo_url} alt={sf.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary">
                        <span className="text-primary-foreground font-bold text-lg">
                          {sf.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground text-base">{sf.name}</h3>
                  {sf.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{sf.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Package size={14} />
                    <span>{sf.product_count} {sf.product_count === 1 ? "product" : "products"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GrailedLayout>
  );
};

export default Storefronts;
