import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { MenuItemCard } from '../components/MenuItemCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [restaurantRes, menuRes, reviewsRes] = await Promise.all([
        axios.get(`${API}/restaurants/${id}`),
        axios.get(`${API}/restaurants/${id}/menu`),
        axios.get(`${API}/restaurants/${id}/reviews`)
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    const success = addToCart(item, restaurant);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Restaurant not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen pb-16">
      <div
        className="relative h-80 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url('${restaurant.image}')` }}
        data-testid="restaurant-header"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={() => navigate('/')}
          data-testid="back-button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold heading-font mb-2" data-testid="restaurant-detail-name">
            {restaurant.name}
          </h1>
          <p className="text-lg mb-4">{restaurant.description}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1" data-testid="restaurant-detail-rating">
              <Star className="h-5 w-5 fill-current text-secondary" />
              <span className="font-bold">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              {restaurant.delivery_time}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5" />
              Min. ₦{restaurant.min_order.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="menu" data-testid="menu-tab">Menu</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="reviews-tab">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            {categories.map((category) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-bold heading-font mb-6" data-testid={`category-${category}`}>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-6" data-testid="reviews-list">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl p-6 border border-border/50"
                    data-testid={`review-${review.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold" data-testid="review-user-name">{review.user_name}</span>
                      <div className="flex items-center gap-1 text-secondary">
                        <Star className="h-4 w-4 fill-current" />
                        <span data-testid="review-rating">{review.rating}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground" data-testid="review-comment">{review.comment}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground" data-testid="no-reviews">
                No reviews yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};