"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock3, MapPin, Phone, ReceiptText, RefreshCw, Truck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types/types';

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatusStyles(status: Order['status']) {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

export function OrdersExperience() {
  const { user, token, isHydrated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = Boolean(user && token);

  const loadOrders = async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as Order[] | { error: string };

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(Array.isArray(data) ? 'Failed to load orders' : data.error);
      }

      setOrders(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      loadOrders();
    }
  }, [isHydrated, isLoggedIn, token]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
          <Link href="/menu" className="inline-flex items-center gap-2 transition hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to menu
          </Link>
        </div>

        <section className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Order history</p>
              <h1 className="mt-2 text-3xl font-semibold">Your orders</h1>
              <p className="mt-2 text-slate-500">
                Review your previous checkouts, delivery details, and order status.
              </p>
            </div>
            {isLoggedIn && (
              <Button
                onClick={loadOrders}
                disabled={isLoading}
                variant="outline"
                className="rounded-full border-slate-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </section>

        {!isHydrated ? (
          <section className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
            Checking your account...
          </section>
        ) : !isLoggedIn ? (
          <section className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
            <p className="text-slate-600">Login to view your order history.</p>
            <Button asChild className="mt-5 rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/auth?next=%2Forders">Go to login</Link>
            </Button>
          </section>
        ) : isLoading ? (
          <section className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">Loading orders...</section>
        ) : error ? (
          <section className="mt-8 rounded-[32px] bg-red-50 p-8 text-red-700 shadow-sm">{error}</section>
        ) : (
          <section className="mt-8 space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  <ReceiptText className="h-4 w-4" />
                  {orders.length} orders
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  Total spent: ${totalSpent.toFixed(2)}
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-[32px] bg-white p-8 shadow-sm">
                No orders yet. Start from the menu and finish your first checkout.
              </div>
            ) : (
              orders.map((order) => (
                <article key={order.id} className="rounded-[32px] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold">{order.restaurantName}</h2>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-emerald-700">${order.total.toFixed(2)}</p>
                      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.itemId}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <span>
                          {item.quantity} x {item.name}
                        </span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <p className="inline-flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                      {order.deliveryAddress}
                    </p>
                    <p className="inline-flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 text-emerald-600" />
                      {order.phone}
                    </p>
                    <p className="inline-flex items-start gap-2">
                      <Truck className="mt-0.5 h-4 w-4 text-emerald-600" />
                      Payment: Pay on delivery
                    </p>
                    {order.note ? <p className="text-slate-500">Note: {order.note}</p> : <p className="text-slate-400">No note added.</p>}
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default OrdersExperience;
