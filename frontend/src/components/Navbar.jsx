import React from 'react';
import { ShoppingCart, User, Search, Menu, FastForward, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl py-3 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-primary p-2 rounded-2xl shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
          <FastForward size={22} className="text-white fill-white" />
        </div>
        <span className="font-outfit text-2xl font-black tracking-tight dark:text-white text-secondary">
          Go<span className="text-primary italic">Mcaddy</span>
        </span>
      </Link>
      
      <div className="hidden lg:flex items-center space-x-10">
        <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-primary transition-all">Home</Link>
        <Link to="/menu" className="text-xs font-black uppercase tracking-[0.2em] text-primary underline underline-offset-[12px] decoration-2">Menu</Link>
        <Link to="/orders" className="text-xs font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-primary transition-all">Orders</Link>
        <Link to="/help" className="text-xs font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-primary transition-all">Help</Link>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden md:flex items-center bg-black/5 dark:bg-white/5 rounded-2xl px-4 py-2.5 border border-black/5 dark:border-white/5 focus-within:border-primary/50 transition-all">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search specialties..." 
            className="bg-transparent border-none outline-none ml-2 text-xs w-40 focus:w-56 transition-all dark:text-white text-secondary placeholder:text-gray-500"
          />
        </div>

        <div className="h-8 w-[1px] bg-black/5 dark:bg-white/5 mx-1 hidden sm:block"></div>

        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-secondary dark:text-white transition-all active:scale-90"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative group p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
        >
          <ShoppingCart size={20} className="group-hover:text-primary transition-colors text-secondary dark:text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg shadow-primary/40 animate-bounce-slow">
              {cartCount}
            </span>
          )}
        </button>
        
        {token ? (
          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="hidden sm:flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-red-500/50 transition-all font-outfit text-xs font-bold text-secondary dark:text-white uppercase tracking-widest"
          >
            <User size={16} />
            Logout
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all font-outfit text-xs font-black text-white uppercase tracking-widest">
            <User size={16} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
