## Swap verified badge icon to `BadgeCheck`

Single file change: `src/components/VerifiedBadge.tsx`.

Currently the badge uses:
- `Store` icon for the gold "Verified Store" variant
- `Check` icon for the blue "Verified Seller" variant

### Change

Replace both icons with `BadgeCheck` from `lucide-react` so every verified badge (product cards in Marketplace, storefront cards, StorefrontDetail header, Profile page) shares one consistent checkmark mark.

- Update the import: `import { BadgeCheck, Store } from "lucide-react"` (keep `Store` only for the separate `PhysicalStorePill`).
- Use `<BadgeCheck size={iconSize} className="shrink-0" />` in both the "Verified Store" and "Verified Seller" branches.
- Drop the `strokeWidth={3}` from the old `Check` since `BadgeCheck` is a filled-style mark.

No other files need edits — every consumer renders through `VerifiedBadge`, and the `PhysicalStorePill` (separate component) keeps its `Store` icon.