

# Supabase Backend for Messages, Community Feed, and Cart Sync

This plan adds real database backing to all three features that currently use mock/local data.

---

## 1. Database Tables (Migration)

### Messages System
- **conversations** table: tracks buyer-seller conversations, linked to a product
- **messages** table: stores individual messages with sender, content, type (text/offer), and timestamps

### Community Feed
- **community_posts** table: stores posts linked to a product, with caption, likes count, views count
- **community_comments** table: stores comments on posts
- **community_post_likes** table: tracks which users liked which posts (prevents double-liking)

### Cart Sync
- **cart_items** table: stores cart items per user with product_id, quantity

All tables will have proper RLS policies so users can only access their own data (messages they're part of, their own cart, etc.), while community posts are publicly readable.

---

## 2. RLS Policies Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| conversations | Participants only | Authenticated users | No | No |
| messages | Conversation participants | Conversation participants | No | No |
| community_posts | Anyone (public) | Authenticated users (own) | Owner only | Owner only |
| community_post_likes | Anyone | Authenticated | No | Own likes only |
| community_comments | Anyone | Authenticated | Own only | Own only |
| cart_items | Own items | Authenticated (own) | Own items | Own items |

---

## 3. Component Updates

### ChatInterface.tsx
- Replace mock data with Supabase queries
- Fetch conversations for the logged-in user
- Real-time message sending/receiving using Supabase inserts
- Display actual user profiles (display_name, avatar) from the profiles table via a security definer function

### CommunityFeed.tsx
- Replace mock posts with Supabase queries joining community_posts with products and profiles
- Real like/unlike functionality using community_post_likes table
- Display real comment counts
- Add ability to create new posts (sellers can post their products to the feed)

### useCart.tsx
- When user is logged in: sync cart to/from Supabase cart_items table
- When user is not logged in: keep localStorage fallback
- On login: merge localStorage cart with Supabase cart
- On logout: clear local state

---

## 4. New Security Definer Functions

- **get_conversation_participants(conversation_id)**: safely check if a user is part of a conversation (used in RLS)
- **get_community_posts()**: return posts with author info without exposing sensitive profile data
- **get_or_create_conversation(other_user_id, product_id)**: create a conversation between two users about a product

---

## 5. Technical Details

### Database Migration SQL (key tables)

```text
-- Conversations
conversations (
  id uuid PK,
  participant_1 uuid NOT NULL,  -- references auth.users
  participant_2 uuid NOT NULL,
  product_id uuid REFERENCES products(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Messages  
messages (
  id uuid PK,
  conversation_id uuid REFERENCES conversations(id),
  sender_id uuid NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text',  -- text, offer, image
  offer_amount numeric,
  offer_item_name text,
  created_at timestamptz DEFAULT now()
)

-- Community Posts
community_posts (
  id uuid PK,
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id),
  caption text,
  likes_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Community Post Likes
community_post_likes (
  id uuid PK,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
)

-- Community Comments
community_comments (
  id uuid PK,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- Cart Items
cart_items (
  id uuid PK,
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
)
```

### Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create all tables, RLS policies, and security definer functions |
| `src/components/ChatInterface.tsx` | Rewrite to use Supabase queries |
| `src/components/CommunityFeed.tsx` | Rewrite to use Supabase queries |
| `src/hooks/useCart.tsx` | Add Supabase sync for logged-in users |
| `src/hooks/useMessages.tsx` | New hook for messaging queries |
| `src/hooks/useCommunityFeed.tsx` | New hook for community feed queries |

---

## 6. Implementation Order

1. Run database migration (tables, RLS, functions)
2. Create `useMessages` hook and update `ChatInterface`
3. Create `useCommunityFeed` hook and update `CommunityFeed`
4. Update `useCart` with Supabase sync logic
5. Test all three features end-to-end

