import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  sellerId: string;
}

const SellerRating = ({ sellerId }: Props) => {
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("rating")
        .eq("seller_id", sellerId);
      if (data && data.length > 0) {
        setTotal(data.length);
        setAvg(data.reduce((s, r: any) => s + r.rating, 0) / data.length);
      }
      setLoaded(true);
    })();
  }, [sellerId]);

  if (!loaded || total === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-sm">
      <Star size={14} className="text-yellow-500" fill="currentColor" />
      <span className="font-medium tabular-nums">{avg.toFixed(1)}</span>
      <span className="text-muted-foreground">
        · {total} {total === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
};

export default SellerRating;
