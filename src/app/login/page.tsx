'use client';

import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import type { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post<{ user: User; token: string }>('/api/login', form);
      if (response?.success && response.data?.token && response.data?.user) {
        setSession(response.data.user, response.data.token);
        router.push('/products');
        return;
      }
      setError(response?.error ?? 'Invalid credentials. Please try again.');
    } catch (_error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Welcome back
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Sign in to My App.</h1>
          <p className="text-secondary/70">
            Access your dashboard to create, update, and manage every product in your catalog.
          </p>
          <div className="rounded-xl border border-border bg-white p-4 text-sm text-secondary/70">
            Secure sessions, role-aware access, and transparent inventory updates are waiting inside.
          </div>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Login</h2>
            <p className="text-sm text-secondary/70">Use the credentials you registered with.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" isLoading={loading} className="w-full">
                Sign In
              </Button>
              <p className="text-sm text-secondary/70">
                New to My App? <a className="text-primary" href="/register">Create an account</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
