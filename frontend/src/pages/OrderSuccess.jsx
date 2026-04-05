import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => (
    <div className="min-h-screen flex items-center justify-center p-6 transition-all duration-500 bg-white dark:bg-[#0F172A]">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl w-full text-center p-12 md:p-20 bg-white dark:bg-[#1E293B] rounded-[4rem] shadow-2xl border border-black/5 dark:border-white/5"
        >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30">
                <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="font-outfit text-5xl font-black tracking-tighter text-secondary dark:text-white mb-6">Payment Secured!</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-12">Your order has been dispatched to our premium kitchen. Get ready for an authentic experience.</p>
            
            <div className="flex flex-col gap-4">
                <Link to="/orders" className="btn-primary py-5 rounded-2xl font-outfit font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                    Track Your Order <ArrowRight size={18} />
                </Link>
                <Link to="/" className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Continue Shopping
                </Link>
            </div>
        </motion.div>
    </div>
);

export default OrderSuccess;
