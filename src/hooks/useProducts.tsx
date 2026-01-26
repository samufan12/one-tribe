import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  size?: string;
  location: string;
  images: string[];
  likes: number;
  views: number;
  created_at: string;
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

// Sample products for when the database is empty
const sampleProducts: Product[] = [
  {
    id: 'sample-1',
    title: 'Traditional Ethiopian Kemis - White with Gold Embroidery',
    description: 'Beautiful handwoven kemis with intricate gold tilet embroidery. Perfect for holidays and special occasions.',
    price: 185,
    category: 'Traditional Wear',
    condition: 'New',
    size: 'M',
    location: 'Addis Ababa, Ethiopia',
    images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=600&fit=crop'],
    likes: 24,
    views: 156,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Eritrean Zuria - Handmade Traditional Dress',
    description: 'Elegant white zuria with colorful border embroidery. Made by skilled artisans in Asmara.',
    price: 220,
    category: 'Traditional Wear',
    condition: 'New',
    size: 'L',
    location: 'Asmara, Eritrea',
    images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop'],
    likes: 18,
    views: 98,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Somali Dirac Set - Blue Gradient',
    description: 'Stunning dirac with matching garbasaar. Lightweight fabric perfect for warm weather celebrations.',
    price: 145,
    category: 'Traditional Wear',
    condition: 'New',
    size: 'S',
    location: 'Mogadishu, Somalia',
    images: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop'],
    likes: 31,
    views: 203,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Kenyan Kikoy Beach Wrap - Multicolor',
    description: 'Authentic Kenyan kikoy, handwoven on the coast. Versatile wrap for beach or home.',
    price: 45,
    category: 'Home & Decor',
    condition: 'New',
    location: 'Mombasa, Kenya',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'],
    likes: 42,
    views: 287,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-5',
    title: 'Ethiopian Coffee Ceremony Set - Complete',
    description: 'Traditional jebena set with cups, incense burner, and serving tray. Authentic clay pottery.',
    price: 125,
    category: 'Coffee & Spices',
    condition: 'New',
    location: 'Harar, Ethiopia',
    images: ['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=600&fit=crop'],
    likes: 56,
    views: 412,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-6',
    title: 'Handcrafted Silver Earrings - Habesha Style',
    description: 'Delicate silver earrings featuring traditional Ethiopian cross motifs. Lightweight and elegant.',
    price: 68,
    category: 'Jewelry',
    condition: 'New',
    location: 'Addis Ababa, Ethiopia',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    likes: 89,
    views: 534,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-7',
    title: 'Somali Henna Art Kit - Premium',
    description: 'Complete henna kit with natural powder, essential oils, and traditional design stencils.',
    price: 35,
    category: 'Art',
    condition: 'New',
    location: 'Hargeisa, Somalia',
    images: ['https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600&h=600&fit=crop'],
    likes: 23,
    views: 167,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-8',
    title: 'Vintage Ethiopian Painting - Saint George',
    description: 'Hand-painted religious art on goatskin. Traditional Ethiopian Orthodox iconography.',
    price: 350,
    category: 'Art',
    condition: 'Like New',
    location: 'Gondar, Ethiopia',
    images: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop'],
    likes: 15,
    views: 89,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-9',
    title: 'Maasai Beaded Necklace - Red & White',
    description: 'Authentic Maasai beadwork necklace. Handmade by Maasai women in Kenya.',
    price: 55,
    category: 'Jewelry',
    condition: 'New',
    location: 'Nairobi, Kenya',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop'],
    likes: 67,
    views: 345,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-10',
    title: 'Ethiopian Netela Shawl - Cream with Border',
    description: 'Lightweight handwoven cotton shawl with traditional tibeb border. Perfect layering piece.',
    price: 75,
    category: 'Traditional Wear',
    condition: 'New',
    size: 'One Size',
    location: 'Bahir Dar, Ethiopia',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop'],
    likes: 38,
    views: 223,
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-11',
    title: 'Kenyan Soapstone Elephant - Hand Carved',
    description: 'Beautiful Kisii soapstone elephant sculpture. Each piece is unique and handcrafted.',
    price: 42,
    category: 'Home & Decor',
    condition: 'New',
    location: 'Kisumu, Kenya',
    images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=600&fit=crop'],
    likes: 29,
    views: 178,
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-12',
    title: 'Premium Ethiopian Coffee Beans - Yirgacheffe',
    description: 'Single-origin Ethiopian coffee beans from Yirgacheffe region. Floral and fruity notes.',
    price: 28,
    category: 'Coffee & Spices',
    condition: 'New',
    location: 'Addis Ababa, Ethiopia',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop'],
    likes: 92,
    views: 567,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async (searchTerm = '', category = 'All') => {
    try {
      setLoading(true);
      
      // Use the anonymous function to get products without user_id
      const { data: productsData, error: productsError } = await supabase
        .rpc('get_public_products');

      if (productsError) throw productsError;

      // Use sample products if database is empty
      let dataToUse = (productsData && productsData.length > 0) ? productsData : sampleProducts;

      // Filter by search term and category client-side
      let filteredProducts = dataToUse;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }

      if (category !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }

      // Check if user liked each product (only for real products)
      const productsWithLikes: Product[] = await Promise.all(
        filteredProducts.map(async (product) => {
          let is_liked = false;
          if (user && !product.id.startsWith('sample-')) {
            const { data } = await supabase
              .rpc('has_user_liked_product', { product_id: product.id });
            is_liked = data || false;
          }
          return {
            ...product,
            images: product.images || [],
            is_liked,
          };
        })
      );

      setProducts(productsWithLikes);
    } catch (error: any) {
      // If there's an error, fall back to sample products
      setProducts(sampleProducts);
      toast({
        title: "Using sample data",
        description: "Showing sample listings",
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