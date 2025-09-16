import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type Product = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  size?: string;
  location: string;
  images: string[];
  status: 'active' | 'sold' | 'draft';
  likes: number;
  views: number;
  created_at: string;
  updated_at: string;
  seller?: {
    display_name: string;
    avatar_url?: string;
  };
  is_liked?: boolean;
};

export type CreateProductData = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  size?: string;
  location: string;
  images: File[];
  status?: 'active' | 'draft';
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async (searchTerm = '', category = 'All') => {
    try {
      setLoading(true);
      
      // First get products
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data: productsData, error: productsError } = await query;
      if (productsError) throw productsError;

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        return;
      }

      // Get seller profiles
      const userIds = [...new Set(productsData.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      // Get product likes for current user
      let likesData: any[] = [];
      if (user) {
        const productIds = productsData.map(p => p.id);
        const { data: userLikes } = await supabase
          .from('product_likes')
          .select('product_id')
          .eq('user_id', user.id)
          .in('product_id', productIds);
        likesData = userLikes || [];
      }

      const productsWithLikes: Product[] = productsData.map(product => ({
        ...product,
        status: product.status as 'active' | 'sold' | 'draft',
        images: product.images || [],
        seller: profilesData?.find(p => p.user_id === product.user_id) ? {
          display_name: profilesData.find(p => p.user_id === product.user_id)?.display_name || 'Anonymous',
          avatar_url: profilesData.find(p => p.user_id === product.user_id)?.avatar_url,
        } : undefined,
        is_liked: likesData.some(like => like.product_id === product.id),
      }));

      setProducts(productsWithLikes);
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a product",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);

      // Upload images first
      const imageUrls: string[] = [];
      for (const file of productData.images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create product
      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          user_id: user.id,
          images: imageUrls,
          status: productData.status || 'active'
        });

      if (error) throw error;

      toast({
        title: "Product created successfully",
        description: "Your item has been listed in the marketplace",
      });

      // Refresh products
      await fetchProducts();
      return true;
    } catch (error: any) {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like products",
        variant: "destructive",
      });
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (product.is_liked) {
        // Unlike
        await supabase
          .from('product_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        // Like
        await supabase
          .from('product_likes')
          .insert({
            user_id: user.id,
            product_id: productId
          });
      }

      // Update local state
      setProducts(products.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes: p.is_liked ? p.likes - 1 : p.likes + 1
            }
          : p
      ));
    } catch (error: any) {
      toast({
        title: "Error updating like",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    toggleLike,
  };
};