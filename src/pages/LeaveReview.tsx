import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";
import { z } from "zod";
import GrailedLayout from "@/components/GrailedLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

interface OrderInfo {
  seller_id: string;
  buyer_id: string;
  product_id: string | null;
  product_title: string | null;
  seller_name: string | null;
}

const LeaveReview = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [existingReview, setExistingReview] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!orderId) return;

    (async () => {
      setLoading(true);

      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      if (existing) {
        setExistingReview(true);
        setLoading(false);
        return;
      }

      const { data: orderRow, error } = await supabase
        .from("orders")
        .select("seller_id, buyer_id, product_id")
        .eq("id", orderId)
        .maybeSingle();

      if (error || !orderRow) {
        toast.error("Order not found");
        setLoading(false);
        return;
      }

      if (orderRow.buyer_id !== user.id) {
        toast.error("You can only review your own orders");
        setLoading(false);
        return;
      }

      let productTitle: string | null = null;
      if (orderRow.product_id) {
        const { data: p } = await supabase
          .from("products")
          .select("title")
          .eq("id", orderRow.product_id)
          .maybeSingle();
        productTitle = p?.title ?? null;
      }

      const { data: sellerProfile } = await supabase.rpc("get_public_profile", {
        profile_user_id: orderRow.seller_id,
      });
      const sellerName =
        Array.isArray(sellerProfile) && sellerProfile[0]?.display_name
          ? sellerProfile[0].display_name
          : null;

      setOrder({
        seller_id: orderRow.seller_id,
        buyer_id: orderRow.buyer_id,
        product_id: orderRow.product_id,
        product_title: productTitle,
        seller_name: sellerName,
      });
      setLoading(false);
    })();
  }, [orderId, user, authLoading, navigate]);

  const handleSubmit = async () => {
    if (!order || !orderId || !user) return;
    if (!order.product_id) {
      toast.error("This order has no product to review");
      return;
    }

    const parsed = reviewSchema.safeParse({ rating, comment: comment.trim() || undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please select a rating");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      order_id: orderId,
      reviewer_id: user.id,
      seller_id: order.seller_id,
      product_id: order.product_id,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("እንኳን ደስ አለዎ! Thank you for your review");
    setTimeout(() => navigate("/marketplace"), 1200);
  };

  if (authLoading || loading) {
    return (
      <GrailedLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </GrailedLayout>
    );
  }

  if (existingReview) {
    return (
      <GrailedLayout>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            You've already reviewed this order
          </h1>
          <p className="text-muted-foreground mb-8">
            Thanks for sharing your experience with the community.
          </p>
          <Button onClick={() => navigate("/marketplace")}>Back to marketplace</Button>
        </div>
      </GrailedLayout>
    );
  }

  if (!order) {
    return (
      <GrailedLayout>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold mb-3">Order not available</h1>
          <Button onClick={() => navigate("/marketplace")}>Back to marketplace</Button>
        </div>
      </GrailedLayout>
    );
  }

  return (
    <GrailedLayout>
      <div className="max-w-xl mx-auto px-6 py-16">
        <p className="text-eyebrow text-muted-foreground mb-3">Leave a review</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          {order.product_title ?? "Your order"}
        </h1>
        {order.seller_name && (
          <p className="text-muted-foreground mb-10">Sold by {order.seller_name}</p>
        )}

        <div className="space-y-8">
          <div>
            <label className="text-sm font-medium mb-3 block">Your rating</label>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = (hover || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    className="p-1"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={32}
                      className={filled ? "text-yellow-500" : "text-muted-foreground/40"}
                      fill={filled ? "currentColor" : "none"}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-medium mb-3 block">
              Tell others about your experience
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you loved, how it fit, how quickly it arrived…"
              rows={5}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-2">{comment.length}/1000</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="w-full h-12 rounded-full"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit review"}
          </Button>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default LeaveReview;
