"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, UserCircle2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, logout, isHydrated } = useAuth();
  const authHref =
    pathname && pathname !== '/auth'
      ? `/auth?next=${encodeURIComponent(pathname)}`
      : '/auth';
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'Orders' },
  ];
  const isActivePath = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950">
              <a href=""></a>
            </div>
            <div>
              <p className="text-lg font-semibold">GoMcaddy</p>
              <p className="text-xs text-slate-400">Food delivery and ordering</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition hover:text-white',
                  isActivePath(link.href) ? 'text-white' : 'text-slate-300'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && isHydrated ? (
              <Link
                href={authHref}
                className={cn(
                  'transition hover:text-white',
                  pathname === '/auth' ? 'text-white' : 'text-slate-300'
                )}
              >
                Login / Signup
              </Link>
            ) : null}
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
            ) : isHydrated ? (
              <Button asChild variant="secondary" className="hidden rounded-full bg-white text-slate-950 hover:bg-slate-200 md:inline-flex">
                <Link href={authHref}>Sign in</Link>
              </Button>
            ) : null}

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

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[310px] border-white/10 bg-slate-950 p-0 text-white sm:max-w-[310px]"
              >
                <div className="flex h-full flex-col">
                  <SheetHeader className="border-b border-white/10 px-6 py-6 text-left">
                    <SheetTitle className="text-white">Navigation</SheetTitle>
                    <SheetDescription className="text-slate-400">
                      Browse the app, manage your orders, and access your account.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 px-6 py-6">
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition',
                              isActivePath(link.href)
                                ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
                                : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:text-white'
                            )}
                          >
                            <span>{link.label}</span>
                            {isActivePath(link.href) ? (
                              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">Open</span>
                            ) : null}
                          </Link>
                        </SheetClose>
                      ))}

                      {isHydrated && !user ? (
                        <SheetClose asChild>
                          <Link
                            href={authHref}
                            className={cn(
                              'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition',
                              pathname === '/auth'
                                ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
                                : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:text-white'
                            )}
                          >
                            <span>Login / Signup</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Account</span>
                          </Link>
                        </SheetClose>
                      ) : null}
                    </div>

                    {isHydrated && user ? (
                      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                            <UserCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>

                        <SheetClose asChild>
                          <button
                            onClick={logout}
                            className="mt-5 w-full rounded-full border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:text-white"
                          >
                            Logout
                          </button>
                        </SheetClose>
                      </div>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
