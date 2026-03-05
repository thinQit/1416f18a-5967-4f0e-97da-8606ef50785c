'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="container">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-8 shadow-lg">
          <div className="mb-6 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back to Prodly</h1>
            <p className="text-sm text-secondary">Sign in to manage your product catalog.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
              required
            />
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-secondary">
            New to Prodly?{' '}
            <a href="/register" className="font-semibold text-primary hover:text-primary-hover">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
