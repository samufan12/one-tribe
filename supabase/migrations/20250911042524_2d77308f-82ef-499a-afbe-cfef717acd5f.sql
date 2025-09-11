-- Drop the security definer view which causes security concerns
DROP VIEW IF EXISTS public.public_profiles;

-- The functions are sufficient and safer for accessing public profile data
-- No additional changes needed - the functions provide secure access patterns