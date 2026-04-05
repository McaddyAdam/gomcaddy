import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Chrome, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 transition-all duration-500 bg-white dark:bg-[#0F172A] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] -z-10"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-xl bg-white/90 dark:bg-[#1E293B] p-10 md:p-16 rounded-[4rem] shadow-2xl border border-black/5 dark:border-white/5 relative z-10 backdrop-blur-2xl"
            >
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary p-4 rounded-3xl shadow-xl shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Lock size={32} className="text-white fill-white" />
                        </div>
                    </div>
                    <h2 className="font-outfit text-5xl font-black tracking-tighter text-secondary dark:text-white mb-4">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Order your favorite Nigerian flavors in seconds.</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-sm font-bold mb-8 flex items-center gap-3"
                    >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 ml-2">Email Identity</label>
                        <div className="relative group">
                            <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="email" 
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl py-5 pl-16 pr-8 outline-none focus:border-primary/50 transition-all font-bold text-secondary dark:text-white placeholder:text-gray-500"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center ml-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Security Key</label>
                            <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 transition-all">Forgot?</a>
                        </div>
                        <div className="relative group">
                            <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="password" 
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl py-5 pl-16 pr-8 outline-none focus:border-primary/50 transition-all font-bold text-secondary dark:text-white placeholder:text-gray-500"
                                placeholder="••••••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full btn-primary py-6 rounded-3xl font-outfit font-black text-lg uppercase tracking-widest mt-4 shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In To Account'}
                        {!loading && <ArrowRight size={24} />}
                    </button>
                </form>

                <div className="mt-14">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/5 dark:border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                            <span className="bg-white dark:bg-[#1E293B] px-6 text-gray-500">Secure Social Connect</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 py-4 rounded-3xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-outfit font-black text-xs uppercase tracking-widest text-secondary dark:text-white">
                            <Chrome size={18} /> Google
                        </button>
                        <button className="flex items-center justify-center gap-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 py-4 rounded-3xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-outfit font-black text-xs uppercase tracking-widest text-secondary dark:text-white">
                            <Github size={18} /> Github
                        </button>
                    </div>

                    <p className="mt-12 text-center text-sm text-gray-500 font-bold uppercase tracking-widest">
                        New to GoMcaddy? <Link to="/signup" className="text-primary hover:underline underline-offset-8 decoration-2 ml-2">Create Professional Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
