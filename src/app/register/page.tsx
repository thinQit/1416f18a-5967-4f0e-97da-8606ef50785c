'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="container">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-8 shadow-lg">
          <div className="mb-6 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create your Prodly account</h1>
            <p className="text-sm text-secondary">Start building your product catalog in minutes.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
              required
            />
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-secondary">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-primary hover:text-primary-hover">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
