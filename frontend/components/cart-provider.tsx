"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MenuItem, Restaurant } from '@/types/types';

interface CartItem extends MenuItem {
  restaurantId: string;
  restaurantName: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (restaurant: Restaurant, item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  clearRestaurantCart: (restaurantId: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'gomcaddy-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) {
        return;
      }

      const parsed = JSON.parse(storedValue);
      if (Array.isArray(parsed)) {
        setItems(
          parsed.filter(
            (item): item is CartItem =>
              item &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.restaurantId === 'string' &&
              typeof item.restaurantName === 'string' &&
              typeof item.quantity === 'number' &&
              typeof item.price === 'number'
          )
        );
        return;
      }
    } catch {
      // Ignore stale or malformed local storage data.
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = (restaurant: Restaurant, item: MenuItem) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find((entry) => entry.id === item.id);

        if (existingItem) {
          return currentItems.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
          );
        }

        return [
          ...currentItems,
          {
            ...item,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            quantity: 1,
          },
        ];
      });
    };

    const removeItem = (itemId: string) => {
      setItems((currentItems) =>
        currentItems
          .map((entry) =>
            entry.id === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry
          )
          .filter((entry) => entry.quantity > 0)
      );
    };

    const clearCart = () => {
      setItems([]);
    };

    const clearRestaurantCart = (restaurantId: string) => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.restaurantId !== restaurantId)
      );
    };

    return {
      items,
      addItem,
      removeItem,
      clearCart,
      clearRestaurantCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
