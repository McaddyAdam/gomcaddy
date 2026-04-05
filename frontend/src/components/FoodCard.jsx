import React from 'react';
import { Star, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ food }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    addToCart(food);
    setIsCartOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group flex flex-col h-full bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
            Authentic
          </span>
          <span className="bg-secondary/70 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
            {food.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button 
            onClick={handleAddToCart}
            className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 font-outfit text-sm font-black uppercase tracking-widest"
          >
            <Plus size={18} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-outfit text-xl font-black tracking-tight text-secondary dark:text-white leading-tight flex-grow">
            {food.name}
          </h3>
          <p className="font-outfit text-lg font-black text-primary whitespace-nowrap">
            ₦{food.price.toLocaleString()}
          </p>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
          {food.description}
        </p>

        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="font-black text-xs dark:text-white text-secondary">4.9</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">(120+ Orders)</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="text-primary font-black text-xs uppercase tracking-widest hover:underline underline-offset-[6px] decoration-2 transition-all"
          >
            Order Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
