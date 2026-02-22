
## Storefronts Feature (On-Platform)

Sellers can create a storefront -- essentially a branded shop page on OneTribe -- and buyers can browse storefronts to discover sellers and their products. No physical store details like hours or address are needed; everything stays on-platform.

### What You'll Get

- Sellers can create a storefront with a name, description, logo, and cover image
- Each storefront gets a public page showing the seller's branding and all their listed products
- A "Storefronts" browse page where buyers can discover shops
- Sidebar navigation updates: "Storefronts" under Shopping, "My Storefront" under Selling (sellers only)

### Database Changes

**New `storefronts` table:**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | One storefront per seller (unique) |
| name | text | Store name |
| description | text | About the store (nullable) |
| logo_url | text | Nullable |
| cover_image_url | text | Nullable |
| is_active | boolean | Default true |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

**RLS Policies:**
- SELECT: anyone can view active storefronts
- INSERT: authenticated sellers can create their own (user_id = auth.uid())
- UPDATE: owner only
- DELETE: owner only

**New database function:** `get_public_storefronts()` -- returns storefront info with product count, without exposing user_id (consistent with existing privacy model).

**New database function:** `get_storefront_with_products(storefront_id)` -- returns storefront details and its products for the detail page.

### New Pages and Components

1. **`src/pages/Storefronts.tsx`** -- Browse all active storefronts in a card grid (logo, name, description snippet, product count)
2. **`src/pages/StorefrontDetail.tsx`** -- View a storefront's cover image, logo, name, description, and product grid (route: `/storefront/:id`)
3. **`src/components/CreateStorefront.tsx`** -- Form for sellers to create/edit their storefront (name, description, logo upload, cover image upload)
4. **`src/pages/CreateStorefrontPage.tsx`** -- Page wrapper using GrailedLayout

### Navigation and Routing

- Sidebar "Shopping" section: add "Storefronts" item (Store icon)
- Sidebar "Selling" section: add "My Storefront" item (visible only to sellers)
- New routes in App.tsx:
  - `/storefronts` -- browse storefronts
  - `/storefront/:id` -- storefront detail
  - `/create-storefront` -- create/edit storefront (seller only)

### Technical Details

- Images use the existing `product-images` storage bucket
- Products are linked to storefronts by matching `user_id` -- no schema change needed on the products table
- The storefront detail page reuses the same product card UI from Marketplace
- An `updated_at` trigger will be added to the storefronts table (same pattern as profiles)
- The `get_public_storefronts()` function hides `user_id` and joins with products to return a count
- Seller sees "My Storefront" link which either opens their storefront or the create form if they don't have one yet

### Implementation Steps

1. Create the `storefronts` table migration with RLS policies and security definer functions
2. Create the storefront form component with image uploads
3. Create the storefronts browse page
4. Create the storefront detail page
5. Update sidebar data and filtering logic
6. Register new routes in App.tsx
