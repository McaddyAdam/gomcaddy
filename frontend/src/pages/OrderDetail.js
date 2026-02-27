import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Phone, Star } from 'lucide-react';
import { useAuth, getAuthHeader } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
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

const orderStatuses = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 5000);
      return () => clearInterval(interval);
    }
  }, [user, id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${id}`, {
        headers: getAuthHeader()
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${API}/reviews`,
        {
          restaurant_id: order.restaurant_id,
          order_id: order.id,
          rating: review.rating,
          comment: review.comment
        },
        { headers: getAuthHeader() }
      );
      toast.success('Review submitted successfully!');
      setReviewDialog(false);
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Order not found</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">View All Orders</Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = orderStatuses.indexOf(order.status);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="mb-6"
          data-testid="back-to-orders-button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="bg-card rounded-3xl p-8 border border-border/50 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold heading-font mb-2" data-testid="order-detail-title">
                Order from {order.restaurant_name}
              </h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <Badge className={`${statusColors[order.status]} text-white text-sm px-4 py-2`} data-testid="order-detail-status">
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {order.status !== 'cancelled' && order.status !== 'pending' && (
            <div className="mb-8">
              <h3 className="font-bold mb-4">Order Tracking</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-muted"></div>
                {orderStatuses.map((status, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative flex items-center mb-6 last:mb-0"
                      data-testid={`tracking-step-${status}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        {isCompleted && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className={`font-medium ${
                          isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-6 mb-6">
            <h3 className="font-bold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between" data-testid={`order-item-${idx}`}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-4 border-t border-border">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary" data-testid="order-detail-total">
                ₦{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-bold mb-4">Delivery Address</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div data-testid="delivery-address">
                  <p>{order.delivery_address.street}</p>
                  <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p data-testid="delivery-phone">{order.delivery_address.phone}</p>
              </div>
              {order.notes && (
                <div className="pt-2">
                  <p className="text-muted-foreground">Notes: {order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {order.status === 'delivered' && (
            <div className="border-t border-border pt-6 mt-6">
              <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-full" data-testid="leave-review-button">
                    <Star className="h-4 w-4 mr-2" />
                    Leave a Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate your experience</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className="focus:outline-none"
                            data-testid={`rating-star-${star}`}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Comment (Optional)</Label>
                      <Textarea
                        id="comment"
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        placeholder="Share your experience..."
                        className="mt-1"
                        data-testid="review-comment-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      disabled={submitting}
                      data-testid="submit-review-button"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};