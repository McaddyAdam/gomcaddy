import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodCard from '../components/FoodCard';
import axios from 'axios';

const Menu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Rice', 'Swallow', 'Grill', 'Snacks', 'Drinks'];

    useEffect(() => {
        const fetchFood = async () => {
            try {
                // For now using mock data if API fails, but trying to fetch from backend
                const res = await axios.get('/api/food').catch(() => null);
                if (res && res.data.length > 0) {
                    setFoodItems(res.data);
                    setFilteredItems(res.data);
                } else {
                    // Fallback mock data
                    const mockData = [
                        { _id: '1', name: 'Smoky Party Jollof', price: 5500, category: 'Rice', image: 'https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?auto=format&fit=crop&q=80&w=800', description: 'Legendary Nigerian party jollof with that signature smoky flavor.' },
                        { _id: '2', name: 'Pounded Yam & Egusi', price: 7000, category: 'Swallow', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800', description: 'Silky smooth pounded yam served with rich melon seed soup.' },
                        { _id: '3', name: 'Beef Suya (Special)', price: 4000, category: 'Grill', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb0258143?auto=format&fit=crop&q=80&w=800', description: 'Thinly sliced beef grilled over charcoal with yaji spice.' },
                        { _id: '4', name: 'Amala & Abula', price: 5500, category: 'Swallow', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&q=80&w=800', description: 'Authentic black yam flour with gbegiri, ewedu, and buka stew.' },
                        { _id: '5', name: 'Gizdodo', price: 4500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800', description: 'A perfect marriage of peppered gizzard and fried plantain cubes.' },
                        { _id: '6', name: 'Chapman (Signature)', price: 2500, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', description: 'The famous Nigerian mocktail with bitters and citrus.' },
                    ];
                    setFoodItems(mockData);
                    setFilteredItems(mockData);
                }
            } catch (error) {
                console.error("Error fetching food:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, []);

    useEffect(() => {
        let result = foodItems;
        if (category !== 'All') {
            result = result.filter(item => item.category === category);
        }
        if (searchQuery) {
            result = result.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredItems(result);
    }, [category, searchQuery, foodItems]);

    return (
        <div className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-12 h-[2px] bg-primary"></span>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Curated Selection</span>
                    </div>
                    <h1 className="font-outfit text-6xl md:text-8xl font-black tracking-tighter mb-6 text-secondary dark:text-white leading-[0.9]">Explore Our <br /><span className="text-primary">Culinary</span> Heritage.</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Discover flavors that excite your palate and satisfy your cravings. From smoky grills to traditional swallows.</p>
                </div>
                
                <div className="w-full lg:w-auto">
                    <div className="relative group min-w-[320px]">
                        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find your favorite Nigerian dish..." 
                            className="w-full bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 shadow-xl shadow-black/5 transition-all font-medium text-secondary dark:text-white placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Filter size={18} />
                    </div>
                    <span className="font-outfit font-black uppercase tracking-widest text-xs text-secondary dark:text-white">Filter by Category</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-8 py-3.5 rounded-2xl font-outfit font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-lg ${
                                category === cat 
                                ? 'bg-primary text-white shadow-primary/30 scale-105' 
                                : 'bg-white dark:bg-[#1E293B] text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/5 hover:border-primary/50 hover:text-primary shadow-black/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-[450px] animate-pulse bg-black/5 dark:bg-white/5 rounded-[2.5rem]"></div>
                    ))}
                </div>
            ) : (
                <>
                    {filteredItems.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map(item => (
                                    <FoodCard key={item._id} food={item} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-32 bg-white dark:bg-[#1E293B] rounded-[4rem] border border-dashed border-black/10 dark:border-white/10 shadow-2xl shadow-black/5">
                            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                <ShoppingBag size={40} className="text-gray-400" />
                            </div>
                            <h3 className="font-outfit text-3xl font-black mb-4 text-secondary dark:text-white">No dishes found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium mb-10">We couldn't find any matches for your request. Try adjusting your filters or search keywords.</p>
                            <button 
                                onClick={() => {setCategory('All'); setSearchQuery('');}}
                                className="btn-primary px-10 py-4 text-sm"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Menu;
