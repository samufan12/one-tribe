import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import GrailedLayout from "@/components/GrailedLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SellerOnboarding = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return setLoading(false);
    const { data } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("user_id", user.id)
      .maybeSingle();
    setStripeAccountId(data?.stripe_account_id ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    if (params.get("success") === "true") {
      toast.success("Payouts connected — you're ready to sell.");
    }
    if (params.get("refresh") === "true") {
      toast.info("Onboarding link expired. Start again to continue.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleConnect = async () => {
    if (!user) return toast.error("Please sign in first");
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error("No onboarding URL returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start onboarding");
      setConnecting(false);
    }
  };

  return (
    <GrailedLayout>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link
          to="/seller-tools"
          className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to seller tools
        </Link>

        <div className="mt-8">
          <p className="text-eyebrow text-muted-foreground mb-3">Payouts</p>
          <h1
            className="font-semibold tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Get paid for your sales
          </h1>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : stripeAccountId ? (
          <div className="mt-12 border border-border rounded-sm p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={28} />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Payouts connected</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your Stripe account is linked. Sales will be paid out to your bank
                  account automatically after each completed order, minus the 8%
                  platform fee.
                </p>
                <p className="text-xs text-muted-foreground/80 pt-2">
                  Account: <span className="font-mono">{stripeAccountId}</span>
                </p>
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="mt-4 text-xs underline underline-offset-4 hover:no-underline disabled:opacity-50"
                >
                  {connecting ? "Loading…" : "Manage payout details →"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 border border-border rounded-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-2">
                Set up payouts to receive money from your sales
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use Stripe to send your earnings directly to your bank account.
                Onboarding takes a few minutes — you'll need a government ID and
                bank details. Habesha sellers across the diaspora trust this flow.
              </p>
            </div>

            <ul className="text-sm text-muted-foreground space-y-2 border-t border-border pt-6">
              <li className="flex gap-3"><span className="text-foreground">·</span> Secure, bank-grade encryption via Stripe</li>
              <li className="flex gap-3"><span className="text-foreground">·</span> Automatic payouts after each sale</li>
              <li className="flex gap-3"><span className="text-foreground">·</span> 8% platform fee deducted at payout</li>
            </ul>

            <button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full h-14 bg-foreground text-background text-sm font-medium tracking-tight rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all duration-200 disabled:opacity-60"
            >
              {connecting ? "Redirecting to Stripe…" : "Connect Bank Account"}
            </button>
          </div>
        )}
      </div>
    </GrailedLayout>
  );
};

export default SellerOnboarding;
