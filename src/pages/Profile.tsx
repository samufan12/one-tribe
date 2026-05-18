import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { SellerOnboardingChecklist } from "@/components/SellerOnboardingChecklist";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserRole();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [shippingRegions, setShippingRegions] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
    }
    if (user) {
      supabase.from("profiles").select("shipping_regions").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => setShippingRegions(((data as any)?.shipping_regions ?? []).join(", ")));
    }
  }, [profile, user?.id]);

  if (authLoading || profileLoading) {
    return <GrailedLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div></GrailedLayout>;
  }
  if (!user) return null;

  const initials = (displayName || user.email || "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ display_name: displayName || null, phone: phone || null, bio: bio || null });
      const regions = shippingRegions.split(",").map((r) => r.trim()).filter(Boolean);
      await supabase.from("profiles").update({ shipping_regions: regions } as any).eq("user_id", user.id);
      toast({ title: "Saved", description: "Your profile is up to date." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="block border-b border-border pb-5">
      <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );

  const inputCls = "w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-lg tracking-tight";

  return (
    <GrailedLayout>
      {/* Editorial header */}
      <section className="border-b border-border/60">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-4">
            <div className="w-32 h-32 rounded-full bg-foreground text-background flex items-center justify-center text-4xl font-light tracking-tight">
              {initials}
            </div>
          </div>
          <div className="md:col-span-8">
            <p className="text-eyebrow text-muted-foreground mb-3">Your account</p>
            <h1
              className="font-semibold tracking-[-0.03em] leading-[1]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              {displayName || "Welcome back."}
            </h1>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              {profile?.verification_status === "verified" ? (
                <VerifiedBadge
                  verificationStatus="verified"
                  businessName={profile?.business_name}
                  size="md"
                />
              ) : profile?.verification_status === "pending" ? (
                <span className="text-[11px] tracking-wide uppercase text-muted-foreground border border-border rounded-full px-2.5 py-1">
                  Verification pending
                </span>
              ) : null}
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-6">
        <SellerOnboardingChecklist />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="text-eyebrow text-muted-foreground mb-3">Profile</p>
          <h2 className="text-2xl font-semibold tracking-tight">How you appear<br /><span className="italic font-light text-muted-foreground">to the tribe.</span></h2>
        </div>

        <div className="md:col-span-8 space-y-7">
          <Field label="Display name">
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className={inputCls} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 ___ ___ ____" className={inputCls} />
          </Field>
          <Field label="Bio">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short note about yourself" rows={3} className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Shipping regions (comma-separated)">
            <input value={shippingRegions} onChange={(e) => setShippingRegions(e.target.value)} placeholder="e.g. USA, Canada, Europe" className={inputCls} />
          </Field>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-12 px-8 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 active:scale-[0.99] transition-all duration-200 ease-spring disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
            <button onClick={signOut} className="h-12 px-8 border border-border text-sm font-medium rounded-full hover:border-foreground transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default ProfilePage;
