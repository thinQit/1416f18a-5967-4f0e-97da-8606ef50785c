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

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post<{ user: User; token: string }>('/api/register', form);
      if (response?.success && response.data?.token && response.data?.user) {
        setSession(response.data.user, response.data.token);
        router.push('/products');
        return;
      }
      setError(response?.error ?? 'Registration failed. Please check your details.');
    } catch (_error) {
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Create your account
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Join My App to manage your catalog.</h1>
          <p className="text-secondary/70">
            Set up your secure workspace in minutes. Track inventory, publish products, and keep everything organized from one dashboard.
          </p>
          <ul className="space-y-3 text-sm text-secondary/70">
            <li>✔ Secure JWT-based authentication</li>
            <li>✔ Create and edit products with ease</li>
            <li>✔ Public listings with search and pagination</li>
          </ul>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Register</h2>
            <p className="text-sm text-secondary/70">Start building your product catalog today.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
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
                Create Account
              </Button>
              <p className="text-sm text-secondary/70">
                Already have an account? <a className="text-primary" href="/login">Sign in</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
