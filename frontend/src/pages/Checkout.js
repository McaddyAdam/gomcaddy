import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, getAuthHeader } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, restaurantId, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    phone: user?.phone || ''
  });
  const [notes, setNotes] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        restaurant_id: restaurantId,
        items: cart,
        delivery_address: address,
        notes
      };

      const orderResponse = await axios.post(`${API}/orders`, orderData, {
        headers: getAuthHeader()
      });

      const order = orderResponse.data;
      const callbackUrl = `${window.location.origin}/payment/callback`;

      const paymentResponse = await axios.post(
        `${API}/payment/initialize`,
        {
          order_id: order.id,
          callback_url: callbackUrl
        },
        { headers: getAuthHeader() }
      );

      clearCart();
      window.location.href = paymentResponse.data.authorization_url;
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error.response?.data?.detail || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold heading-font mb-8" data-testid="checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-3xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold heading-font mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="mt-1"
                  data-testid="street-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="mt-1"
                    data-testid="city-input"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                    className="mt-1"
                    data-testid="state-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                  className="mt-1"
                  data-testid="phone-input"
                />
              </div>
              <div>
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions?"
                  className="mt-1"
                  data-testid="notes-input"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold heading-font mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.menu_item_id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center mb-6">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-bold heading-font text-primary" data-testid="checkout-total">
                ₦{total.toLocaleString()}
              </span>
            </div>
            <Button
              type="submit"
              className="w-full rounded-full h-14 text-lg"
              disabled={loading}
              data-testid="pay-now-button"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};