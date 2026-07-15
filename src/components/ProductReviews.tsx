import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reviewer_id: string;
  created_at: string;
  reviewer_name?: string;
}

interface Props {
  productId: string;
}

const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <div className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={n <= Math.round(value) ? "text-yellow-500" : "text-muted-foreground/30"}
        fill={n <= Math.round(value) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

const ProductReviews = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, reviewer_id, created_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const list = data as Review[];
      setTotal(list.length);
      setAvg(list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0);

      const uniqueIds = Array.from(new Set(list.slice(0, 5).map((r) => r.reviewer_id)));
      const nameMap = new Map<string, string>();
      await Promise.all(
        uniqueIds.map(async (uid) => {
          const { data: p } = await supabase.rpc("get_public_profile", { profile_user_id: uid });
          const name = Array.isArray(p) && p[0]?.display_name ? p[0].display_name : "Anonymous";
          nameMap.set(uid, name);
        })
      );

      setReviews(
        list.slice(0, 5).map((r) => ({ ...r, reviewer_name: nameMap.get(r.reviewer_id) ?? "Anonymous" }))
      );
      setLoading(false);
    })();
  }, [productId]);

  if (loading) return null;

  return (
    <section className="border-t border-border pt-8">
      <div className="flex items-baseline justify-between mb-6">
        <p className="text-eyebrow text-muted-foreground">Reviews</p>
        {total > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={avg} />
            <span className="font-medium tabular-nums">{avg.toFixed(1)}</span>
            <span className="text-muted-foreground">· {total} {total === 1 ? "review" : "reviews"}</span>
          </div>
        )}
      </div>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reviews yet — be the first to buy and review this item
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-border/40 pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} />
                  <span className="text-sm font-medium">{r.reviewer_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(r.created_at), "MMM d, yyyy")}
                </span>
              </div>
              {r.comment && (
                <p className="text-sm text-foreground/90 leading-relaxed">{r.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductReviews;
