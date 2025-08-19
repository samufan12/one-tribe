import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'seller' | 'buyer';

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

  const becomeSeller = async (businessData: {
    business_name: string;
    business_address: string;
    business_phone: string;
  }) => {
    if (!user) return;

    try {
      // Add seller role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'seller' });

      if (roleError) throw roleError;

      // Update profile with business information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: businessData.business_name,
          business_address: businessData.business_address,
          business_phone: businessData.business_phone,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Refresh data
      await fetchUserData();
    } catch (error) {
      console.error('Error becoming seller:', error);
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
    becomeSeller,
    updateProfile,
    refetch: fetchUserData,
  };
};