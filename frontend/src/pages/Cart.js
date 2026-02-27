import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, total, restaurantName } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
          <Button onClick={() => navigate('/login')} className="rounded-full">Login</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="empty-cart-title">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious items to get started</p>
          <Button onClick={() => navigate('/')} className="rounded-full" data-testid="browse-restaurants-button">
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold heading-font mb-2" data-testid="cart-title">Your Cart</h1>
        <p className="text-muted-foreground mb-8">From {restaurantName}</p>

        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <motion.div
              key={item.menu_item_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-card rounded-2xl p-6 border border-border/50 flex gap-4"
              data-testid={`cart-item-${item.menu_item_id}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2" data-testid="cart-item-name">{item.name}</h3>
                <p className="text-primary font-bold" data-testid="cart-item-price">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                  data-testid="decrease-quantity-button"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold w-8 text-center" data-testid="cart-item-quantity">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                  data-testid="increase-quantity-button"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive rounded-full"
                  onClick={() => removeFromCart(item.menu_item_id)}
                  data-testid="remove-item-button"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold">Total</span>
            <span className="text-3xl font-bold heading-font text-primary" data-testid="cart-total">
              ₦{total.toLocaleString()}
            </span>
          </div>
          <Button
            onClick={() => navigate('/checkout')}
            className="w-full rounded-full h-14 text-lg"
            data-testid="proceed-to-checkout-button"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};