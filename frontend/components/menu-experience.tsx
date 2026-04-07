"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock3, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types/types';

interface MenuExperienceProps {
  restaurantId?: string;
}

export function MenuExperience({ restaurantId }: MenuExperienceProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurantId || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, items, removeItem, totalPrice } = useCart();

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
                  <span className="text-2xl font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Login or register to continue checkout once your backend auth is active.
                </p>
                <Button asChild className="mt-5 w-full rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                  <Link href="/auth">Continue to login</Link>
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
