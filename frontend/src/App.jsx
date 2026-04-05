import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen transition-colors duration-300">
          <Navbar />
          <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        <footer className="py-12 px-6 md:px-12 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>&copy; 2026 GoMcaddy. All rights reserved. Designed with ❤️ for food lovers.</p>
        </footer>
      </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
