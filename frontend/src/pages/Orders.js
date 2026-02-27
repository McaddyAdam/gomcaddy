import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Clock } from 'lucide-react';
import { useAuth, getAuthHeader } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-purple-500',
  ready: 'bg-orange-500',
  picked_up: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const statusLabels = {
  pending: 'Pending Payment',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  picked_up: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: getAuthHeader()
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your orders</p>
          <Button onClick={() => navigate('/login')} className="rounded-full">Login</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4" data-testid="no-orders-title">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">Start ordering to see your order history</p>
          <Button onClick={() => navigate('/')} className="rounded-full" data-testid="start-ordering-button">
            Start Ordering
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold heading-font mb-8" data-testid="orders-title">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl p-6 border border-border/50"
              onClick={() => navigate(`/orders/${order.id}`)}
              style={{ cursor: 'pointer' }}
              data-testid={`order-card-${order.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1" data-testid="order-restaurant-name">
                    {order.restaurant_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge className={`${statusColors[order.status]} text-white`} data-testid="order-status">
                  {statusLabels[order.status]}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-muted-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-bold" data-testid="order-total">
                  Total: ₦{order.total.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground capitalize" data-testid="order-payment-status">
                  Payment: {order.payment_status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};