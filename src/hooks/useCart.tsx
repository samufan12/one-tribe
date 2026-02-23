import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  condition: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "onetribe-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [synced, setSynced] = useState(false);

  // Persist to localStorage always
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync FROM Supabase when user logs in
  const syncFromSupabase = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("user_id", user.id);

    if (!data || data.length === 0) {
      // Push local cart to Supabase if any
      if (items.length > 0) {
        await Promise.all(
          items.map((item) =>
            supabase.from("cart_items").upsert(
              { user_id: user.id, product_id: item.id, quantity: item.quantity },
              { onConflict: "user_id,product_id" }
            )
          )
        );
      }
      setSynced(true);
      return;
    }

    // Fetch product details for items from Supabase
    const productIds = data.map((d) => d.product_id);
    const { data: products } = await supabase.rpc("get_public_products");

    if (products) {
      const productMap = new Map(products.map((p: any) => [p.id, p]));
      const merged = new Map<string, CartItem>();

      // Add Supabase items
      for (const dbItem of data) {
        const product = productMap.get(dbItem.product_id);
        if (product) {
          merged.set(dbItem.product_id, {
            id: dbItem.product_id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
            quantity: dbItem.quantity,
            category: product.category,
            condition: product.condition,
            size: product.size || undefined,
          });
        }
      }

      // Merge local items that aren't in Supabase yet
      for (const localItem of items) {
        if (!merged.has(localItem.id)) {
          merged.set(localItem.id, localItem);
          supabase.from("cart_items").upsert(
            { user_id: user.id, product_id: localItem.id, quantity: localItem.quantity },
            { onConflict: "user_id,product_id" }
          );
        }
      }

      setItems(Array.from(merged.values()));
    }
    setSynced(true);
  }, [user]);

  useEffect(() => {
    if (user && !synced) syncFromSupabase();
    if (!user) setSynced(false);
  }, [user, synced, syncFromSupabase]);

  const syncToSupabase = useCallback(
    async (productId: string, quantity: number) => {
      if (!user) return;
      if (quantity <= 0) {
        await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
      } else {
        await supabase.from("cart_items").upsert(
          { user_id: user.id, product_id: productId, quantity },
          { onConflict: "user_id,product_id" }
        );
      }
    },
    [user]
  );

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      syncToSupabase(item.id, newQuantity);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    syncToSupabase(id, 0);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    syncToSupabase(id, quantity);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
    setItems([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
