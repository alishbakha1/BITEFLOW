import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "biteflow_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // Restaurant the current cart belongs to (BiteFlow supports one active
  // restaurant per cart, same as most delivery apps)
  const [restaurantId, setRestaurantId] = useState(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_restaurant`) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (restaurantId) localStorage.setItem(`${STORAGE_KEY}_restaurant`, restaurantId);
  }, [restaurantId]);

  // Adds one unit of `item`. If the cart has items from a different
  // restaurant, it clears the cart first (single-restaurant-per-order model).
  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    if (item.restaurantId) setRestaurantId(item.restaurantId);
  }, []);

  // Removes one unit; removes the line entirely once quantity hits 0
  const removeItem = useCallback((itemId) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  // Removes the whole line regardless of quantity
  const deleteItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem(`${STORAGE_KEY}_restaurant`);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}