"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, MapPin, Search, ShieldCheck, Star } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import type { Category, Restaurant, StoreCount } from '@/types/types';

export function HomeExperience() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeCount, setStoreCount] = useState<StoreCount | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantsResponse, categoriesResponse, storeCountResponse] = await Promise.all([
          fetch('/api/restaurants?type=restaurant'),
          fetch('/api/categories'),
          fetch('/api/store-count'),
        ]);

        const [restaurantsData, categoriesData, storeCountData] = await Promise.all([
          restaurantsResponse.json(),
          categoriesResponse.json(),
          storeCountResponse.json(),
        ]);

        setRestaurants(restaurantsData);
        setCategories(categoriesData.slice(0, 8));
        setStoreCount(storeCountData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load data');
      }
    };

    loadData();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return restaurants.slice(0, 6);
    }

    return restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.categories.some((category) =>
          category.name.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [query, restaurants]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),_transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                Online Food Delivery Website
              </div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Browse restaurants, explore menus, and order food from one clean dashboard.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-300">
                Gomcaddy is built around the real product flow you described: restaurant discovery,
                menu browsing, cart management, and login/signup for users.
              </p>

              <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-emerald-950/40 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search restaurants or food"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-12 pr-4 text-white outline-none transition focus:border-emerald-400"
                  />
                </div>
                <Button asChild className="h-14 rounded-2xl bg-emerald-500 px-6 text-base font-semibold text-slate-950 hover:bg-emerald-400">
                  <Link href="/menu">
                    View menus
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setQuery(category.name)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400/50 hover:bg-emerald-500/10"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Project objectives</p>
                <div className="mt-6 grid gap-4">
                  {[
                    'Frontend + Backend integration',
                    'REST APIs and database operations',
                    'Authentication and authorization readiness',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Restaurants" value={storeCount?.restaurants ?? 0} />
                <MetricCard label="Grocery shops" value={storeCount?.grocery ?? 0} />
                <MetricCard label="Total stores" value={storeCount?.total ?? 0} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Home page</p>
              <h2 className="mt-3 text-3xl font-semibold">Featured restaurants</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/5">
              <Link href="/menu">Open menu page</Link>
            </Button>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">{error}</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/menu/${restaurant.id}`}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-emerald-400/40"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-5">
                      <div className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
                        {restaurant.discount ? `${restaurant.discount}% OFF` : 'Ready to order'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {restaurant.categories.map((category) => category.name).join(' • ')}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
                        <div className="flex items-center gap-1 text-amber-300">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-semibold">{restaurant.ratings.average.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-slate-400">{restaurant.ratings.count} ratings</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-emerald-300" />
                        <span>Menu ready in minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-300" />
                        <span>Open menu</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-white/10 bg-slate-900/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Functional modules</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <FeatureCard title="Home page" text="Search restaurants, discover categories, and jump directly to any menu." />
              <FeatureCard title="Menu page" text="Browse food items, see prices, and add meals straight to the cart." />
              <FeatureCard title="Login / Signup" text="Register users, validate email and password fields, and connect to backend auth." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeExperience;

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-slate-300">{text}</p>
    </div>
  );
}
