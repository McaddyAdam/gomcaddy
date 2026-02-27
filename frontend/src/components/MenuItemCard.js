import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 flex gap-4 items-center hover:bg-muted/50 transition-colors border border-border/30"
      data-testid={`menu-item-${item.id}`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-xl"
      />
      <div className="flex-1">
        <h4 className="font-bold text-lg mb-1" data-testid="menu-item-name">
          {item.name}
        </h4>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary" data-testid="menu-item-price">
            ₦{item.price.toLocaleString()}
          </span>
          {item.available ? (
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => onAddToCart(item)}
              data-testid="add-to-cart-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};