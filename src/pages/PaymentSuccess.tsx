import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrailedLayout from "@/components/GrailedLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OrderRow {
  id: string;
  buyer_id: string;
  seller_id: string | null;
  product_id: string | null;
  product_ids: string[];
  stripe_session_id: string | null;
  subtotal: number;
  platform_fee: number;
  total: number;
  amount_total: number | null;
  seller_payout: number | null;
  status: string;
  created_at: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [productTitles, setProductTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Poll for the order — webhook may take a couple seconds to insert it
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const tryFetch = async () => {
      attempts += 1;
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        setOrder(data as OrderRow);
        // Pull product titles via public RPC (respects anonymity rules)
        const ids = (data.product_ids?.length ? data.product_ids : data.product_id ? [data.product_id] : []) as string[];
        if (ids.length > 0) {
          const { data: products } = await supabase.rpc("get_public_products");
          if (products && !cancelled) {
            const map = new Map(products.map((p: any) => [p.id, p.title as string]));
            setProductTitles(ids.map((id) => map.get(id) ?? "Your item"));
          }
        }
        setLoading(false);
      } else if (attempts < maxAttempts) {
        setTimeout(tryFetch, 1500);
      } else {
        setLoading(false);
      }
    };

    tryFetch();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const isSellerView = !!(user && order?.seller_id && order.seller_id === user.id);
  const isBuyerView = !!(user && order && order.buyer_id === user.id);

  const amountPaid = order
    ? order.amount_total != null
      ? order.amount_total / 100
      : Number(order.total)
    : 0;
  const sellerPayout = order?.seller_payout != null ? order.seller_payout / 100 : null;
  const platformCut = order ? Number(order.platform_fee) : 0;

  return (
    <GrailedLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping absolute w-24 h-24 bg-green-200 rounded-full opacity-50" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isSellerView ? "You made a sale!" : "Payment successful!"}
          </h1>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
              <Loader2 size={16} className="animate-spin" /> Confirming your order…
            </div>
          ) : order ? (
            <>
              <p className="text-muted-foreground mb-6">
                {isSellerView
                  ? "Your item has sold. We'll release the payout to your bank shortly."
                  : "Thank you for your purchase. The seller has been notified and will prepare your order for shipping."}
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left space-y-4">
                {productTitles.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
                      {productTitles.length === 1 ? "Item" : "Items"}
                    </p>
                    <ul className="space-y-1 text-sm font-medium text-foreground">
                      {productTitles.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isSellerView ? "Buyer paid" : "Amount paid"}
                    </span>
                    <span className="tabular-nums font-medium">${amountPaid.toFixed(2)}</span>
                  </div>

                  {isSellerView && sellerPayout != null && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform fee</span>
                        <span className="tabular-nums">− ${platformCut.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-eyebrow text-muted-foreground">Your payout</span>
                        <span className="tabular-nums font-semibold text-foreground">
                          ${sellerPayout.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isBuyerView && (
                <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="text-primary" size={20} />
                    <h3 className="font-semibold text-foreground">What's next?</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>· Email confirmation on the way</li>
                    <li>· Seller prepares your item for shipping</li>
                    <li>· Tracking info once it ships</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. The seller has been notified and will prepare your order for shipping.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate(isSellerView ? "/seller-tools" : "/marketplace")} className="flex-1">
              {isSellerView ? "Seller dashboard" : "Continue shopping"}
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/messages")} className="flex-1">
              {isSellerView ? "Message buyer" : "Message seller"}
            </Button>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default PaymentSuccess;
