'use client';

import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
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
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>Create your account</CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
