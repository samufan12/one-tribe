import { useState, useEffect, useCallback } from "react";
import { Product } from "@/hooks/useProducts";

const RECENTLY_VIEWED_KEY = "recently_viewed";
const MAX_RECENTLY_VIEWED = 8;

interface RecentlyViewedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  condition: string;
  viewedAt: number;
}

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
      }
    }
  }, []);

  // Add a product to recently viewed
  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const newItem: RecentlyViewedProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "",
        category: product.category,
        condition: product.condition,
        viewedAt: Date.now(),
      };

      // Remove if already exists, add to front
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [newItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED);

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
};
