import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { PaymentCallback } from './pages/PaymentCallback';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Toaster } from './components/ui/sonner';
import Footer from './components/Footer';
import '@/App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/callback"
          element={
            <ProtectedRoute>
              <PaymentCallback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;