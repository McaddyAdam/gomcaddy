import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group cursor-pointer"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      data-testid={`restaurant-card-${restaurant.id}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Closed</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold heading-font mb-2" data-testid="restaurant-name">
          {restaurant.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {restaurant.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-secondary font-medium" data-testid="restaurant-rating">
            <Star className="h-4 w-4 fill-current" />
            {restaurant.rating}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {restaurant.delivery_time}
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Min. order: ₦{restaurant.min_order.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};