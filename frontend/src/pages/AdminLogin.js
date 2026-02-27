import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', 'true');
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <Link to="/" className="text-3xl font-bold heading-font text-primary">
              GoMcaddy Admin
            </Link>
            <h2 className="text-2xl font-bold heading-font mt-6 mb-2" data-testid="admin-login-title">
              Admin Portal
            </h2>
            <p className="text-muted-foreground">Login to manage orders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1"
                data-testid="admin-username-input"
                placeholder="Enter your admin username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1"
                data-testid="admin-password-input"
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full h-12 text-lg"
              disabled={loading}
              data-testid="admin-login-button"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-primary hover:underline text-sm">
              Back to customer site
            </Link>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground">
            <p className="font-medium mb-1">Need access?</p>
            <p>If you need admin access, contact <strong>admin@mcaddytechsolutions.com</strong>.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};