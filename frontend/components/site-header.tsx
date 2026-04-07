"use client";

import Link from 'next/link';
import { ShoppingBag, UserCircle2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950">
            G
          </div>
          <div>
            <p className="text-lg font-semibold">Gomcaddy</p>
            <p className="text-xs text-slate-400">Food delivery and ordering</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/auth">Login / Signup</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm md:flex">
              <UserCircle2 className="h-4 w-4" />
              <span>{user.name}</span>
              <button onClick={logout} className="text-slate-400 transition hover:text-white">
                Logout
              </button>
            </div>
          ) : (
            <Button asChild variant="secondary" className="hidden rounded-full bg-white text-slate-950 hover:bg-slate-200 md:inline-flex">
              <Link href="/auth">Sign in</Link>
            </Button>
          )}

          <Link
            href="/menu"
            className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-bold text-slate-950">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
