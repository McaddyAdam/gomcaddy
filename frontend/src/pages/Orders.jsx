import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const res = await axios.get('/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error('Fetch orders failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto transition-all duration-500 bg-white dark:bg-[#0F172A]">
            <div className="mb-20">
                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Order History</span>
                <h1 className="font-outfit text-6xl font-black tracking-tighter text-secondary dark:text-white leading-tight">Your Culinary <br /> Journey.</h1>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]"></div>)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-[#1E293B] rounded-[4rem] border border-dashed border-black/10 dark:border-white/10 shadow-2xl shadow-black/5">
                    <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h3 className="font-outfit text-3xl font-black mb-4 text-secondary dark:text-white">No orders yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium mb-10">Start your premium Nigerian food journey by adding something to your basket.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {orders.map((order) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#1E293B] p-10 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order Reference: #{order._id.slice(-8)}</span>
                                    </div>
                                    <h3 className="font-outfit text-4xl font-black text-secondary dark:text-white">₦{order.totalAmount.toLocaleString()}</h3>
                                    <p className="text-gray-500 font-medium flex items-center gap-2"><Clock size={16} /> {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="w-20 h-20 rounded-3xl overflow-hidden bg-black/5 border-[4px] border-white dark:border-[#1E293B] shadow-xl">
                                                <img src={item.food?.image || 'https://via.placeholder.com/100'} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center font-black text-white text-lg border-[4px] border-white dark:border-[#1E293B] shadow-xl">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <button className="btn-primary px-10 py-5 text-sm rounded-3xl flex items-center gap-3">
                                        View Details <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
