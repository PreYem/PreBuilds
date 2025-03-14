import React, { createContext, useState, useContext, ReactNode } from "react";

interface CartContextType {
  cartItemCount: number;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode; 
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  return (
    <CartContext.Provider value={{ cartItemCount, setCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
