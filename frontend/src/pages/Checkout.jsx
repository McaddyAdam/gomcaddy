import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { usePaystackPayment } from 'react-paystack';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deliveryFee = 1500;
    const totalPayable = cartTotal + deliveryFee;

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email || 'customer@gomcaddy.com',
        amount: totalPayable * 100, // in kobo
        publicKey: 'pk_test_1f3ab8593deef4aa2b57563125206abfb876b539', // test key
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference) => {
        await processOrder('Completed', reference.reference);
    };

    const onClose = () => {
        alert("Payment cancelled.");
        setLoading(false);
    };

    const processOrder = async (paymentStatus, reference = '') => {
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                items: cartItems.map(item => ({
                    food: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalPayable,
                address: address,
                paymentMethod: paymentMethod
            };

            await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            clearCart();
            navigate('/order-success');
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (paymentMethod === 'card') {
            initializePayment(onSuccess, onClose);
        } else {
            await processOrder('Pending');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center transition-all duration-500 bg-white dark:bg-[#0F172A]">
                <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h2 className="font-outfit text-3xl font-black text-secondary dark:text-white mb-4">Your basket is empty</h2>
                <p className="text-gray-500 mb-10 max-w-sm">Looks like you haven't added any Nigerian specialties yet.</p>
                <Link to="/menu" className="btn-primary px-10 py-4">Explore Menu</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto transition-colors duration-500">
            <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-12">
                <ArrowLeft size={16} /> Back to Selection
            </Link>

            <div className="grid lg:grid-cols-2 gap-20">
                {/* Checkout Form */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div>
                        <h1 className="font-outfit text-5xl font-black tracking-tighter text-secondary dark:text-white mb-4">Complete Delivery</h1>
                        <p className="text-gray-500 font-medium">Verify your details and choose your destination.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin size={18} /></div>
                                <h3 className="font-outfit font-black uppercase tracking-widest text-xs text-secondary dark:text-white">Delivery Landmark</h3>
                            </div>
                            <textarea 
                                required
                                placeholder="E.g. House 14, Admiralty Way, Lekki Phase 1, Lagos..."
                                className="w-full bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 min-h-[150px] outline-none focus:border-primary/50 shadow-xl shadow-black/5 transition-all text-secondary dark:text-white placeholder:text-gray-500 font-medium"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary"><CreditCard size={18} /></div>
                                <h3 className="font-outfit font-black uppercase tracking-widest text-xs text-secondary dark:text-white">Payment Selection</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div 
                                    className={`p-6 border-2 ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'} rounded-[2rem] flex flex-col items-center gap-4 cursor-pointer text-center transition-all`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <CreditCard size={24} className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'} />
                                    <span className={`font-outfit font-black text-xs uppercase tracking-widest ${paymentMethod === 'card' ? 'text-secondary dark:text-white' : 'text-gray-500'}`}>Card Payment</span>
                                </div>
                                <div 
                                    className={`p-6 border-2 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'} rounded-[2rem] flex flex-col items-center gap-4 cursor-pointer text-center transition-all`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <ShoppingBag size={24} className={paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'} />
                                    <span className={`font-outfit font-black text-xs uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-secondary dark:text-white' : 'text-gray-500'}`}>Pay on Arrival</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary py-6 rounded-[2.5rem] font-outfit font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Securing Transaction...' : 'Confirm Order Now'}
                            {!loading && <ChevronRight size={24} />}
                        </button>
                    </form>
                </motion.div>

                {/* Summary Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-[#1E293B] rounded-[4rem] p-10 md:p-14 border border-black/5 dark:border-white/5 shadow-2xl h-fit sticky top-32"
                >
                    <h3 className="font-outfit font-black text-2xl text-secondary dark:text-white mb-10 pb-6 border-b border-black/5 dark:border-white/5">Order Ledger</h3>
                    
                    <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center group">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/5">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-outfit font-black text-secondary dark:text-white">{item.name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-black text-primary">₦{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-8 border-t border-black/5 dark:border-white/5">
                        <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            <span>Gross Amount</span>
                            <span>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            <span>Delivery Fee (Express)</span>
                            <span>₦{deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="h-[1px] bg-black/5 dark:bg-white/5 my-6"></div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Payable</p>
                                <p className="font-outfit text-4xl font-black text-secondary dark:text-white">₦{totalPayable.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Safe & Secured
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;
