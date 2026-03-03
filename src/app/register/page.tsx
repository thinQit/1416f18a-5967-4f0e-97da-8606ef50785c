'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface RegisterResponse {
  token: string;
  expiresAt: string;
  user: { id: string; name: string; email: string; role: 'user' | 'admin' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', form);
      login(response.token, response.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Create your ShopFlow account</h1>
            <p className="text-slate-600">
              Join ShopFlow to manage products, track inventory, and publish your storefront in minutes.
            </p>
            <div className="rounded-lg border bg-white p-4 text-sm text-slate-500">
              Already have an account? <Link href="/login" className="text-primary">Sign in here</Link>.
            </div>
          </div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">User Registration</h2>
              <p className="text-sm text-slate-500">Create your admin or staff profile.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full name" value={form.name} onChange={handleChange('name')} required />
                <Input label="Email" type="email" value={form.email} onChange={handleChange('email')} required />
                <Input label="Password" type="password" value={form.password} onChange={handleChange('password')} required />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
