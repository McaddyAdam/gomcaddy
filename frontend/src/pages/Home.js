import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { RestaurantCard } from '../components/RestaurantCard';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [search]);

  const fetchRestaurants = async () => {
    try {
      const params = search ? { search } : {};
      const response = await axios.get(`${API}/restaurants`, { params });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[500px] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url('https://images.pexels.com/photos/17952746/pexels-photo-17952746.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        data-testid="hero-section"
      >
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold heading-font mb-4"
            data-testid="hero-title"
          >
            Chop Now, No Long Thing!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl mb-8"
          >
            Order from the best Nigerian restaurants near you
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-primary/20"
                data-testid="search-input"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold heading-font mb-8" data-testid="restaurants-title">
          Available Restaurants
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground" data-testid="no-restaurants">
            No restaurants found
          </div>
        )}
      </section>
    </div>
  );
};