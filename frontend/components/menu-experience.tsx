"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types/types';

interface MenuExperienceProps {
  restaurantId?: string;
}

export function MenuExperience({ restaurantId }: MenuExperienceProps) {
  const pathname = usePathname();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurantId || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { addItem, items, removeItem, clearRestaurantCart } = useCart();
  const { user, token, isHydrated } = useAuth();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/restaurants?type=restaurant');
        const data = await response.json();
        setRestaurants(data);

        if (!restaurantId && data.length > 0) {
          setSelectedRestaurantId(data[0].id);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load menus');
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurants();
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      setSelectedRestaurantId(restaurantId);
    }
  }, [restaurantId]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) || null,
    [restaurants, selectedRestaurantId]
  );

  const cartItems = useMemo(() => {
    if (!selectedRestaurant) {
      return [];
    }

    return items.filter((item) => item.restaurantId === selectedRestaurant.id);
  }, [items, selectedRestaurant]);

  const selectedTotalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const isLoggedIn = Boolean(user && token);
  const loginHref = useMemo(() => {
    const nextPath =
      pathname.startsWith('/menu/') && restaurantId
        ? pathname
        : selectedRestaurantId
          ? `/menu/${selectedRestaurantId}`
          : '/menu';

    return `/auth?next=${encodeURIComponent(nextPath)}`;
  }, [pathname, restaurantId, selectedRestaurantId]);

  useEffect(() => {
    if (isLoggedIn && checkoutError === 'Please login to complete checkout.') {
      setCheckoutError(null);
    }
  }, [checkoutError, isLoggedIn]);

  const handleCheckout = async () => {
    if (!selectedRestaurant) {
      setCheckoutError('Select a restaurant before checkout.');
      return;
    }

    if (!isHydrated) {
      setCheckoutError('Restoring your login session. Please try again in a moment.');
      return;
    }

    if (!user || !token) {
      setCheckoutError('Please login to complete checkout.');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError('Add food items before checkout.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setCheckoutError('Delivery address is required.');
      return;
    }

    if (!phone.trim()) {
      setCheckoutError('Phone number is required.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      setCheckoutError(null);
      setCheckoutMessage(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: user.name,
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          items: cartItems.map((item) => ({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          paymentMethod: 'pay_on_delivery',
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          note: note.trim(),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        orderId?: string;
        error?: string;
      };

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearRestaurantCart(selectedRestaurant.id);
      setDeliveryAddress('');
      setPhone('');
      setNote('');
      setCheckoutMessage(
        `Order placed successfully. Payment method: Pay on delivery. Order #${data.orderId || 'created'}.`
      );
    } catch (placeOrderError) {
      setCheckoutError(
        placeOrderError instanceof Error ? placeOrderError.message : 'Failed to place order'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
          <Link href="/" className="inline-flex items-center gap-2 transition hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-[32px] bg-white p-10 shadow-sm">Loading menus...</div>
        ) : error ? (
          <div className="rounded-[32px] bg-red-50 p-10 text-red-700">{error}</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
            <aside className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Restaurants</p>
              <div className="mt-4 space-y-3">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurantId(restaurant.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      restaurant.id === selectedRestaurantId
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold">{restaurant.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {restaurant.menu.length} items • {restaurant.categories[0]?.name}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="space-y-6">
              {selectedRestaurant ? (
                <>
                  <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
                    <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                      <img
                        src={selectedRestaurant.image}
                        alt={selectedRestaurant.name}
                        className="h-full min-h-[280px] w-full object-cover"
                      />
                      <div className="p-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Menu page</p>
                        <h1 className="mt-3 text-4xl font-semibold">{selectedRestaurant.name}</h1>
                        <p className="mt-4 text-slate-600">
                          Browse food items, compare prices, and add meals to the cart from one screen.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {selectedRestaurant.ratings.average.toFixed(1)} rating
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                            <Clock3 className="h-4 w-4 text-emerald-600" />
                            Fast delivery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {selectedRestaurant.menu.map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-5 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-[180px_minmax(0,1fr)_160px]"
                      >
                        <img src={item.image} alt={item.name} className="h-44 w-full rounded-3xl object-cover" />
                        <div>
                          {item.featured && (
                            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              Featured item
                            </span>
                          )}
                          <h2 className="mt-3 text-2xl font-semibold">{item.name}</h2>
                          <p className="mt-3 text-slate-600">{item.description}</p>
                          <p className="mt-4 text-sm text-slate-500">Prep time: {item.prepTime}</p>
                        </div>
                        <div className="flex flex-col items-start justify-between md:items-end">
                          <p className="text-3xl font-semibold text-emerald-700">${item.price.toFixed(2)}</p>
                          <Button
                            onClick={() => addItem(selectedRestaurant, item)}
                            className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[32px] bg-white p-10 shadow-sm">Select a restaurant to view its menu.</div>
              )}
            </section>

            <aside className="rounded-[32px] bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Cart</p>
                  <h2 className="text-2xl font-semibold">Your order</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
                    Add food items to cart to see your order summary here.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{item.restaurantName}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[32px] text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            selectedRestaurant &&
                            addItem(selectedRestaurant, {
                              id: item.id,
                              name: item.name,
                              description: item.description,
                              price: item.price,
                              image: item.image,
                              prepTime: item.prepTime,
                              featured: item.featured,
                            })
                          }
                          className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Estimated total</span>
                  <span className="text-2xl font-semibold">${selectedTotalPrice.toFixed(2)}</span>
                </div>

                {!isHydrated ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Checking your login session before checkout...
                  </p>
                ) : !isLoggedIn ? (
                  <>
                    <p className="mt-3 text-sm text-slate-400">
                      Login or register to continue checkout and place your order.
                    </p>
                    <Button
                      asChild
                      className="mt-5 w-full rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    >
                      <Link href={loginHref}>Continue to login</Link>
                    </Button>
                  </>
                ) : (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Checkout</p>
                      <p className="mt-2 text-sm text-slate-300">
                        Logged in as {user?.name}. Add your delivery details and finish your order.
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">Delivery address</span>
                      <textarea
                        value={deliveryAddress}
                        onChange={(event) => setDeliveryAddress(event.target.value)}
                        placeholder="House number, street, area"
                        rows={3}
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">Phone number</span>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="e.g. +1 555 123 4567"
                        className="h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                      />
                    </label>

                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                        <CreditCard className="h-4 w-4" />
                        Payment method
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                        <Truck className="h-4 w-4 text-emerald-300" />
                        Pay on delivery
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">Order note (optional)</span>
                      <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Gate code, nearest landmark, special request"
                        className="h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                      />
                    </label>

                    {checkoutError && (
                      <p className="rounded-2xl border border-red-400/20 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                        {checkoutError}
                      </p>
                    )}

                    {checkoutMessage && (
                      <p className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        {checkoutMessage}
                      </p>
                    )}

                    <Button
                      onClick={handleCheckout}
                      disabled={isPlacingOrder || cartItems.length === 0}
                      className="w-full rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPlacingOrder ? 'Finishing order...' : 'Finish order'}
                    </Button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default MenuExperience;
