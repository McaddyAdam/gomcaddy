import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed.items || []);
      setRestaurantId(parsed.restaurantId);
      setRestaurantName(parsed.restaurantName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: cart, restaurantId, restaurantName }));
  }, [cart, restaurantId, restaurantName]);

  const addToCart = (item, restaurant) => {
    setRestaurantId(restaurant.id);
    setRestaurantName(restaurant.name);

    setCart(prevCart => {
      if (restaurantId && restaurantId !== restaurant.id) {
        const confirm = window.confirm(
          `Your cart contains items from ${restaurantName}. Do you want to clear it and add items from ${restaurant.name}?`
        );
        if (!confirm) return prevCart;
        return [{
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        }];
      }

      const existing = prevCart.find(c => c.menu_item_id === item.id);
      if (existing) {
        return prevCart.map(c =>
          c.menu_item_id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      } else {
        return [...prevCart, {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        }];
      }
    });
    return true;
  };

  const removeFromCart = (itemId) => {
    const updated = cart.filter(item => item.menu_item_id !== itemId);
    setCart(updated);
    if (updated.length === 0) {
      setRestaurantId(null);
      setRestaurantName('');
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.menu_item_id === itemId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    setRestaurantName('');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};