import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, RefreshCw, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'picked_up', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    if (!isAdmin || !token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

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

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-3xl font-bold heading-font text-primary" data-testid="admin-dashboard-title">
                GoMcaddy Admin
              </h1>
              <p className="text-sm text-muted-foreground">Order Management Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={fetchOrders} data-testid="refresh-button">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleLogout} data-testid="admin-logout-button">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-bold heading-font" data-testid="total-orders">{stats.total}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold heading-font text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
            <p className="text-3xl font-bold heading-font text-blue-500">{stats.confirmed}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Preparing</p>
            <p className="text-3xl font-bold heading-font text-purple-500">{stats.preparing}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="text-3xl font-bold heading-font text-green-500">{stats.delivered}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48" data-testid="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground" data-testid="no-orders">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="orders-list">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl p-6 border border-border/50"
                data-testid={`admin-order-${order.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg" data-testid="order-restaurant">
                        {order.restaurant_name}
                      </h3>
                      <Badge className={`${statusColors[order.status]} text-white`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Order #{order.id.slice(0, 8)} • {order.user_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold heading-font text-primary mb-2">
                      ₦{order.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Payment: {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium">Update Status:</p>
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                      disabled={updating === order.id}
                    >
                      <SelectTrigger className="w-48" data-testid="order-status-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updating === order.id && (
                      <span className="text-sm text-muted-foreground">Updating...</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-sm font-medium mb-2">Delivery Address:</p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">Phone: {order.delivery_address.phone}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};