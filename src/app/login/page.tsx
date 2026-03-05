'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">Welcome back to ShopFlow</h1>
            <p className="text-sm text-secondary">Sign in to manage products and view dashboard insights.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@shopflow.io"
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
                placeholder="Enter your password"
                value={form.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
