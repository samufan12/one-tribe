import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Store, Heart, MessageCircle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import kemis1 from "@/assets/kemis-1.jpg";

interface StorefrontProduct {
  product_id: string;
  product_title: string;
  product_description: string;
  product_price: number;
  product_category: string;
  product_condition: string;
  product_size: string | null;
  product_location: string;
  product_images: string[] | null;
  product_likes: number;
  product_views: number;
  product_created_at: string;
}

interface StorefrontInfo {
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  created_at: string;
}

const StorefrontDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [storefront, setStorefront] = useState<StorefrontInfo | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data, error } = await supabase.rpc("get_storefront_with_products", {
        p_storefront_id: id,
      });
      if (!error && data && (data as any[]).length > 0) {
        const rows = data as any[];
        setStorefront({
          name: rows[0].storefront_name,
          description: rows[0].storefront_description,
          logo_url: rows[0].storefront_logo_url,
          cover_image_url: rows[0].storefront_cover_image_url,
          created_at: rows[0].storefront_created_at,
        });
        // Filter out null product rows (storefront with no products)
        setProducts(rows.filter((r) => r.product_id != null));
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new": return "bg-green-100 text-green-800";
      case "like new": return "bg-blue-100 text-blue-800";
      case "good": return "bg-yellow-100 text-yellow-800";
      case "fair": return "bg-orange-100 text-orange-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <GrailedLayout showCategoryNav={false}>
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <Skeleton className="w-full h-56 rounded-lg mb-6" />
          <Skeleton className="w-48 h-8 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </GrailedLayout>
    );
  }

  if (!storefront) {
    return (
      <GrailedLayout showCategoryNav={false}>
        <div className="text-center py-20">
          <Store size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Storefront not found</p>
        </div>
      </GrailedLayout>
    );
  }

  return (
    <GrailedLayout showCategoryNav={false}>
      <div className="max-w-[1400px] mx-auto">
        {/* Cover */}
        <div className="h-56 md:h-72 bg-muted overflow-hidden">
          {storefront.cover_image_url ? (
            <img src={storefront.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store size={48} className="text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="px-4 -mt-10 relative">
          {/* Logo + Name */}
          <div className="flex items-end gap-4 mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-background bg-muted overflow-hidden shrink-0">
              {storefront.logo_url ? (
                <img src={storefront.logo_url} alt={storefront.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                  <span className="text-primary-foreground font-bold text-2xl">
                    {storefront.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-foreground">{storefront.name}</h1>
              {storefront.description && (
                <p className="text-muted-foreground text-sm mt-1">{storefront.description}</p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">This storefront has no products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
              {products.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="group bg-background rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-muted aspect-square">
                    <img
                      src={p.product_images?.[0] || kemis1}
                      alt={p.product_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${getConditionColor(p.product_condition)}`}>
                      {p.product_condition}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">{p.product_category}</p>
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2">{p.product_title}</h3>
                    <p className="font-bold text-foreground">${p.product_price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GrailedLayout>
  );
};

export default StorefrontDetail;
