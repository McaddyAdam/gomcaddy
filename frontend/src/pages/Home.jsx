import React from 'react';
import { ChevronRight, ArrowRight, Play, Star, Clock, ShieldCheck, MapPin, Zap, Utensils, Coffee, Leaf, Flame, GlassWater, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const Home = () => {
    const categories = [
        { name: 'Rice', icon: <Utensils size={24} />, count: '25+ Items' },
        { name: 'Swallow', icon: <Leaf size={24} />, count: '12+ Items' },
        { name: 'Grill', icon: <Flame size={24} />, count: '10+ Items' },
        { name: 'Snacks', icon: <Coffee size={24} />, count: '15+ Items' },
        { name: 'Drinks', icon: <GlassWater size={24} />, count: '8+ Items' },
    ];

    const featuredItems = [
        { id: '1', name: 'Smoky Party Jollof', price: 5500, category: 'Rice', image: 'https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?auto=format&fit=crop&q=80&w=800', description: 'Legendary Nigerian party jollof with that signature smoky flavor.' },
        { id: '2', name: 'Pounded Yam & Egusi', price: 7000, category: 'Swallow', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800', description: 'Silky smooth pounded yam served with rich melon seed soup.' },
        { id: '3', name: 'Beef Suya (Special)', price: 4000, category: 'Grill', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb0258143?auto=format&fit=crop&q=80&w=800', description: 'Thinly sliced beef grilled over charcoal with yaji spice.' }
    ];

    return (
        <div className="pt-20 transition-colors duration-500 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center px-6 md:px-12 py-20">
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
                <div className="absolute bottom-[-20%] right-[-10%] -z-20 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px]"></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[2px] bg-primary"></span>
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Premium Delivery</span>
                        </div>
                        <h1 className="font-outfit text-7xl md:text-9xl font-black leading-[0.9] mb-8 tracking-tighter text-secondary dark:text-white">
                            Authentic <br /> 
                            <span className="text-primary">Nigerian</span> <br />
                            Experience.
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed font-medium">
                            From the smoky streets of Lagos to your doorstep. Experience the finest Nigerian cuisine crafted by local legends.
                        </p>
                        
                        <div className="flex flex-wrap gap-6 items-center">
                            <Link to="/menu" className="btn-primary text-lg py-5 px-10 rounded-[2rem] flex items-center gap-3">
                                Start Ordering
                                <ChevronRight size={22} />
                            </Link>
                            <button className="flex items-center gap-4 group font-outfit font-black text-secondary dark:text-white uppercase tracking-widest text-sm p-2 transition-all">
                                <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                    <Play size={20} className="fill-current text-primary group-hover:text-white ml-1" />
                                </div>
                                See our story
                            </button>
                        </div>

                        <div className="mt-16 flex items-center gap-10">
                            <div className="flex -space-x-4">
                                {[1,2,3,4,5].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-12 h-12 rounded-full border-[3px] border-white dark:border-secondary shadow-lg" />
                                ))}
                            </div>
                            <div className="h-10 w-[1px] bg-black/5 dark:bg-white/10 hidden sm:block"></div>
                            <div>
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <p className="text-sm font-black text-secondary dark:text-white">4.9/5 Rating</p>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-0.5">Top Choice in Nigeria</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-[4rem] overflow-hidden border-[12px] border-black/5 dark:border-white/5 shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?auto=format&fit=crop&q=80&w=1200" 
                                alt="Nigerian Food" 
                                className="w-full h-[700px] object-cover"
                            />
                        </div>
                        
                        {/* Floating elements */}
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-12 -left-12 z-20 bg-white dark:bg-[#1E293B] p-8 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/5"
                        >
                            <div className="flex items-center gap-5">
                                <div className="bg-primary/10 p-4 rounded-3xl text-primary">
                                    <Zap size={32} fill="currentColor" />
                                </div>
                                <div>
                                    <h4 className="font-outfit font-black text-2xl text-secondary dark:text-white tracking-tight">15-20 mins</h4>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Lagos Express Delivery</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 -right-12 z-20 bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/5 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="font-outfit font-black text-secondary dark:text-white">100% Quality</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nafdac Approved</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Slider */}
            <section className="py-24 bg-black/5 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="mb-14">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Wide Variety</span>
                        <h2 className="font-outfit text-5xl font-black tracking-tighter text-secondary dark:text-white">Browse by Category</h2>
                    </div>
                    
                    <div className="flex overflow-x-auto gap-8 no-scrollbar pb-6">
                        {categories.map((cat, idx) => (
                            <Link 
                                to={`/menu?category=${cat.name}`} 
                                key={idx}
                                className="min-w-[240px] bg-white dark:bg-[#1E293B] p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:border-primary transition-all group flex flex-col items-center text-center shadow-lg shadow-black/5"
                            >
                                <div className="w-20 h-20 rounded-[2rem] bg-black/5 dark:bg-white/5 flex items-center justify-center text-secondary dark:text-white group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 mb-6 group-hover:rotate-6">
                                    {cat.icon}
                                </div>
                                <h4 className="font-outfit font-black text-xl text-secondary dark:text-white mb-1">{cat.name}</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{cat.count}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Section */}
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Top Picks</span>
                        <h2 className="font-outfit text-6xl font-black tracking-tighter text-secondary dark:text-white">Customer Favorites</h2>
                    </div>
                    <Link to="/menu" className="flex items-center gap-3 bg-secondary/5 dark:bg-white/5 px-8 py-4 rounded-2xl font-outfit font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-secondary dark:text-white">
                        Full Menu <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {featuredItems.map(item => (
                        <FoodCard key={item.id} food={item} />
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">High Standard</span>
                        <h2 className="font-outfit text-6xl font-black tracking-tighter text-secondary dark:text-white mb-8">Why Choose <br /> GoMcaddy?</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10">We aren't just a delivery service. We are your premium gateway to local culinary excellence.</p>
                        <Link to="/signup" className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary/20 pb-2 hover:border-primary transition-all inline-block">Become a member today</Link>
                    </div>
                    
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                        {[
                            { title: 'Fresh & Organic', desc: 'Sourced daily from local farmers to ensure maximum flavor.', icon: <Leaf size={28} /> },
                            { title: 'Lightning Fast', desc: 'Average delivery time of 20 minutes across major cities.', icon: <Zap size={28} /> },
                            { title: 'Secured Payments', desc: 'Military grade encryption for all your transactions.', icon: <ShieldCheck size={28} /> },
                            { title: 'Hygienically Packed', desc: 'Tamper-proof packaging to keep your food safe and hot.', icon: <MapPin size={28} /> },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1E293B] p-10 rounded-[3rem] border border-black/5 dark:border-white/5 hover:shadow-2xl hover:shadow-black/5 transition-all group">
                                <div className="text-primary mb-8 bg-primary/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-all">
                                    {item.icon}
                                </div>
                                <h4 className="font-outfit font-black text-2xl text-secondary dark:text-white mb-4">{item.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="relative rounded-[5rem] overflow-hidden bg-primary p-16 md:p-32 flex flex-col items-center text-center shadow-2xl shadow-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                    <h2 className="font-outfit text-6xl md:text-8xl font-black tracking-tighter mb-10 text-white relative z-10 leading-tight">
                        Hungry? Let's Fix That <br /> 
                        <span className="opacity-50 italic">In Seconds.</span>
                    </h2>
                    <p className="text-xl text-white/80 max-w-2xl mb-14 relative z-10 font-medium leading-relaxed">
                        Join 20,000+ happy Nigerians who trust us with their daily cravings. High quality, great taste, zero stress.
                    </p>
                    <Link to="/menu" className="bg-white text-primary px-16 py-6 rounded-[2.5rem] font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl relative z-10">
                        Explore Full Menu
                    </Link>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-black/5 dark:border-white/5 mt-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    <div>
                        <h4 className="font-outfit font-black text-secondary dark:text-white uppercase tracking-widest text-xs mb-8">Navigation</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold uppercase tracking-widest">
                            <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
                            <li><Link to="/menu" className="hover:text-primary transition-all">Menu</Link></li>
                            <li><Link to="/orders" className="hover:text-primary transition-all">Orders</Link></li>
                            <li><Link to="/help" className="hover:text-primary transition-all">Help Center</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-outfit font-black text-secondary dark:text-white uppercase tracking-widest text-xs mb-8">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold uppercase tracking-widest">
                            <li><a href="#" className="hover:text-primary transition-all">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-all">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-all">Shipping Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-outfit font-black text-secondary dark:text-white uppercase tracking-widest text-xs mb-8">Social</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold uppercase tracking-widest">
                            <li><a href="#" className="hover:text-primary transition-all">Instagram</a></li>
                            <li><a href="#" className="hover:text-primary transition-all">Twitter</a></li>
                            <li><a href="#" className="hover:text-primary transition-all">Facebook</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-primary p-2 rounded-xl">
                                <FastForward size={18} className="text-white fill-white" />
                            </div>
                            <span className="font-outfit text-xl font-black text-secondary dark:text-white tracking-tight">GoMcaddy</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">Built for the culture. Delivering the taste of Nigeria with pride since 2024.</p>
                    </div>
                </div>
                <div className="text-center pt-12 border-t border-black/5 dark:border-white/5 opacity-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-black uppercase tracking-widest">&copy; 2026 GoMcaddy Tech Solutions. All rights reserved.</p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                        <span>Lagos, Nigeria</span>
                        <span>London, UK</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
