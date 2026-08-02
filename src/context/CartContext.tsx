import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  cartCount: number;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + item.qty } : p,
        );
      }

      return [...prev, item];
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
