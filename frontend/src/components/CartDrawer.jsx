import React from 'react';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        setIsCartOpen(false);
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />
                    
                    {/* Drawer */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0F172A] shadow-2xl z-[201] flex flex-col border-l border-black/5 dark:border-white/5"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="font-outfit text-2xl font-black tracking-tighter text-secondary dark:text-white">Your Basket</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-0.5">{cartItems.length} Selection{cartItems.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="font-outfit text-xl font-black text-secondary dark:text-white">Basket is empty</h3>
                                    <p className="text-sm font-medium mt-2">Start adding some Nigerian flavor!</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div 
                                        layout
                                        key={item._id} 
                                        className="flex gap-6 group"
                                    >
                                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0 shadow-lg border border-black/5 dark:border-white/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-outfit font-black text-lg text-secondary dark:text-white leading-tight">{item.name}</h4>
                                                    <button 
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-primary font-black text-sm">₦{item.price.toLocaleString()}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1.5 border border-black/5 dark:border-white/5">
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-[#1E293B] transition-all disabled:opacity-30 dark:text-white"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-sm dark:text-white">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-[#1E293B] transition-all dark:text-white"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl">
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        <span>Subtotal</span>
                                        <span>₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        <span>Delivery Fee</span>
                                        <span>₦1,500</span>
                                    </div>
                                    <div className="h-[1px] bg-black/5 dark:bg-white/5 my-4"></div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Payable</p>
                                            <p className="font-outfit text-3xl font-black text-secondary dark:text-white">₦{(cartTotal + 1500).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                            VAT Inclusive
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full btn-primary py-6 rounded-3xl font-outfit font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
