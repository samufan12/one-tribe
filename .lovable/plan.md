

# Step 1: Build Out the Profile Page

The Profile page is currently a placeholder. We'll build a functional profile page that lets users view and edit their account information.

## What You'll Get

- **Profile header** with avatar (initials fallback), display name, and email
- **Editable fields**: display name, phone number, and bio
- **Sign out button**
- If the user isn't logged in, they'll be redirected to the auth page

## Technical Details

### Changes to `src/pages/Profile.tsx`
- Import and use `useAuth` to get the current user (email, metadata)
- Import and use `useUserRole` to get/update the profile data from Supabase
- Add an editable form with fields: Display Name, Phone, Bio
- Use existing UI components (Input, Label, Button, Avatar, Textarea)
- Add a "Save Changes" button that calls `updateProfile`
- Add a "Sign Out" button that calls `signOut`
- Redirect unauthenticated users to `/auth`

### No database changes needed
The `profiles` table already has all the required columns (display_name, phone, bio, avatar_url) and RLS policies are already in place.

