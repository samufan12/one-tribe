import { BadgeCheck, Store } from "lucide-react";

interface Props {
  verificationStatus?: string | null;
  businessName?: string | null;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Renders a seller verification badge.
 * - Gold "Verified Store" when verified + has business_name
 * - Blue "Verified Seller" when verified, no business_name
 * - Nothing otherwise
 */
export const VerifiedBadge = ({ verificationStatus, businessName, size = "sm", className = "" }: Props) => {
  if (verificationStatus !== "verified") return null;

  const isStore = !!businessName && businessName.trim().length > 0;
  const sizeCls = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  const iconSize = size === "sm" ? 10 : 12;

  if (isStore) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${sizeCls} bg-[hsl(45_85%_50%/0.15)] text-[hsl(35_75%_35%)] border border-[hsl(45_85%_50%/0.4)] ${className}`}
        title={`Verified store${businessName ? ` — ${businessName}` : ""}`}
      >
        <Store size={iconSize} className="shrink-0" />
        Verified Store
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${sizeCls} bg-[hsl(210_90%_55%/0.12)] text-[hsl(210_85%_40%)] border border-[hsl(210_90%_55%/0.35)] ${className}`}
      title="Verified seller"
    >
      <BadgeCheck size={iconSize} className="shrink-0" />
      Verified Seller
    </span>
  );
};

export const PhysicalStorePill = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full text-[10px] px-2 py-0.5 font-medium tracking-wide bg-secondary text-secondary-foreground border border-border ${className}`}
    title="Has a physical store"
  >
    <Store size={10} className="shrink-0" />
    Physical Store
  </span>
);
