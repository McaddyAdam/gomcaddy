"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, LockKeyhole, Mail, UserCircle2 } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import type { AuthResponse } from '@/types/types';

type Mode = 'login' | 'signup';

export function AuthExperience() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth, user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Name is required for signup.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/${mode === 'signup' ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'signup'
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = (await response.json()) as AuthResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Authentication failed');
      }

      setAuth(data.token, data.user);
      setMessage(mode === 'signup' ? 'Account created successfully.' : 'Login successful.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#08110f_0%,#112019_48%,#f4f0e7_48%,#f4f0e7_100%)]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">User module</p>
            <h1 className="mt-4 text-4xl font-semibold">Login / Signup page</h1>
            <p className="mt-4 text-lg text-slate-300">
              Email and password validation are connected to the backend auth endpoints so users can register and log in.
            </p>

            <div className="mt-8 space-y-4">
              <InfoCard icon={<Mail className="h-5 w-5" />} title="Registration" text="POST /api/register creates a user account with hashed credentials." />
              <InfoCard icon={<LockKeyhole className="h-5 w-5" />} title="Authentication" text="POST /api/login validates credentials and returns a JWT token." />
              <InfoCard icon={<UserCircle2 className="h-5 w-5" />} title="Frontend state" text="Authenticated users are stored in local browser state so the header can reflect sign-in status." />
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/10">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                onClick={() => setMode('login')}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  mode === 'login' ? 'bg-slate-950 text-white' : 'text-slate-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  mode === 'signup' ? 'bg-slate-950 text-white' : 'text-slate-500'
                }`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {mode === 'signup' && (
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Enter your full name"
                />
              )}

              <Field
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />

              <Field
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
                type="password"
              />

              {mode === 'signup' && (
                <Field
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  type="password"
                />
              )}

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
              {user && (
                <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  Signed in as {user.name} ({user.email})
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-emerald-500 text-base font-semibold text-slate-950 hover:bg-emerald-400"
              >
                {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Login'}
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-slate-300">{text}</p>
    </div>
  );
}
