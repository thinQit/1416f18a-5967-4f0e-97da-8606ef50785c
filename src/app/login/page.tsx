'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await api.post<LoginResponse>('/api/auth/login', {
      email: form.email.trim(),
      password: form.password
    });

    if (res.error || !res.data?.accessToken) {
      setLoading(false);
      setError(res.error || 'Unable to login.');
      return;
    }

    localStorage.setItem('token', res.data.accessToken);

    try {
      const meRes = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${res.data.accessToken}` }
      });
      const meData = (await meRes.json()) as MeResponse | { error?: string };

      if (!meRes.ok || 'error' in meData) {
        setLoading(false);
        setError('Failed to load user profile.');
        return;
      }

      setUser({
        id: meData.id,
        email: meData.email,
        name: meData.name,
        role: meData.role === 'admin' ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (_error) {
      setLoading(false);
      setError('Unable to fetch profile.');
      return;
    }

    setLoading(false);
    toast('Logged in successfully', 'success');
    router.push('/products');
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Access your product dashboard.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange('email')} required />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange('password')} required />
        {error && (
          <p className="text-sm text-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          Login
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Need an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
