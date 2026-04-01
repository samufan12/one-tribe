import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { z } from 'zod';
import { sanitizeString } from '@/lib/sanitize';

export type UserRole = 'seller' | 'buyer' | 'admin';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  business_name: string | null;
  business_address: string | null;
  business_phone: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserRoles([]);
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      const roles = rolesData?.map(r => r.role as UserRole) || [];
      setUserRoles(roles);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      setProfile(profileData as UserProfile);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const isSeller = (): boolean => hasRole('seller');
  const isBuyer = (): boolean => hasRole('buyer');
  const isAdmin = (): boolean => hasRole('admin');

  const businessSchema = z.object({
    business_name: z.string().trim().min(2, "Business name too short").max(200),
    business_address: z.string().trim().min(5, "Address too short").max(500),
    business_phone: z.string().trim().min(7, "Phone too short").max(20).regex(/^[+\d\s()-]+$/, "Invalid phone format"),
  });

  const becomeSeller = async (businessData: {
    business_name: string;
    business_address: string;
    business_phone: string;
  }) => {
    if (!user) return;

    const validation = businessSchema.safeParse(businessData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0]?.message || "Invalid business data");
    }

    try {
      const { error: requestError } = await supabase.rpc('request_seller_status');
      if (requestError) throw requestError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: sanitizeString(validation.data.business_name),
          business_address: sanitizeString(validation.data.business_address),
          business_phone: validation.data.business_phone,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;
      await fetchUserData();
    } catch (error) {
      console.error('Error requesting seller status:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    userRoles,
    profile,
    loading,
    hasRole,
    isSeller,
    isBuyer,
    isAdmin,
    becomeSeller,
    updateProfile,
    refetch: fetchUserData,
  };
};