import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Circle, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface Step {
  key: string;
  label: string;
  to: string;
  done: boolean;
}

export const SellerOnboardingChecklist = () => {
  const { user } = useAuth();
  const { profile, refetch } = useUserRole();
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;

    (async () => {
      // 1. profile complete
      const profileComplete = !!(profile.display_name && profile.avatar_url && profile.bio);

      // 2. listing with 3+ photos
      const { data: products } = await supabase
        .from('products')
        .select('id, images')
        .eq('user_id', user.id);
      const hasListingWithPhotos = (products ?? []).some(
        (p: any) => Array.isArray(p.images) && p.images.length >= 3,
      );
      const hasAnyListing = (products ?? []).length > 0;

      // 3. shipping regions
      const { data: prof2 } = await supabase
        .from('profiles')
        .select('shipping_regions, stripe_account_id, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      const shippingSet = ((prof2 as any)?.shipping_regions ?? []).length > 0;
      const stripeConnected = !!(prof2 as any)?.stripe_account_id;
      const alreadyDone = !!(prof2 as any)?.onboarding_completed;

      // 5. shared in community feed
      const { count: feedCount } = await supabase
        .from('community_posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('product_id', 'is', null);
      const sharedInFeed = (feedCount ?? 0) > 0;

      // Only show banner if they have at least one listing or storefront
      const { count: sfCount } = await supabase
        .from('storefronts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      const hasStorefront = (sfCount ?? 0) > 0;

      if (!hasAnyListing && !hasStorefront) {
        setSteps(null);
        return;
      }

      const nextSteps: Step[] = [
        { key: 'profile', label: 'Complete your profile (name, photo, bio)', to: '/profile', done: profileComplete },
        { key: 'photos', label: 'Add 3+ photos to your listing', to: '/sell', done: hasListingWithPhotos },
        { key: 'shipping', label: 'Set your shipping regions', to: '/profile?shipping=1', done: shippingSet },
        { key: 'payouts', label: 'Connect your bank account for payouts', to: '/seller-onboarding', done: stripeConnected },
        { key: 'feed', label: 'Share your first listing in the community feed', to: '/feed', done: sharedInFeed },
      ];
      setSteps(nextSteps);

      const allDone = nextSteps.every((s) => s.done);
      if (allDone && !alreadyDone) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('user_id', user.id);
        refetch();
      }
      if (alreadyDone) setDismissed(true);
    })();
  }, [user?.id, profile?.id, profile?.display_name, profile?.avatar_url, profile?.bio]);

  if (!steps || dismissed) return null;

  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = (completed / total) * 100;

  const handleDismiss = async () => {
    setDismissed(true);
    if (completed === total && user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Complete your seller profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {completed}/{total} steps complete — finish up to start selling with confidence.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <Progress value={pct} className="h-2 mb-5" />

      <ul className="space-y-2">
        {steps.map((s) => (
          <li key={s.key}>
            <Link
              to={s.to}
              className={`group flex items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-accent/40 ${
                s.done ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {s.done ? (
                  <Check size={18} className="text-green-600 shrink-0" />
                ) : (
                  <Circle size={18} className="text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${s.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {!s.done && (
                <ArrowRight size={16} className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
