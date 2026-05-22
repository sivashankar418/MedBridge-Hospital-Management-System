import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, type) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === item._id && i.type === type);
      if (exists) return prev.map(i => i._id === item._id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, type, quantity: 1 }];
    });
  };

  const removeFromCart = (id, type) => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.type === type)));
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity < 1) return removeFromCart(id, type);
    setCartItems(prev => prev.map(i => i._id === id && i.type === type ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
