import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div>
              <div className="text-3xl font-bold heading-font text-primary" data-testid="app-logo">
                GoMcaddy
              </div>
              <div className="text-xs text-muted-foreground -mt-1">Chop Now, No Long Thing</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/cart" data-testid="cart-link">
                  <Button variant="ghost" size="icon" className="relative" data-testid="cart-button">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="user-menu-trigger">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-2 text-sm font-medium" data-testid="user-name">
                      {user.name}
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/orders')} data-testid="orders-menu-item">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} data-testid="logout-menu-item">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button className="rounded-full" data-testid="login-button">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};