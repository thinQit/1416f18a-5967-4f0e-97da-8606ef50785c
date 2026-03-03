'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password.trim()) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', form);
      if (!response.data || response.error) {
        setServerError(response.error || 'Login failed.');
        return;
      }
      localStorage.setItem('token', response.data.token);
      login({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast('Welcome back!', 'success');
      router.push('/products');
    } catch (_error) {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-secondary">Sign in to continue managing your products.</p>
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <h2 className="text-lg font-semibold">Log in</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
              required
            />
            {serverError && (
              <p className="text-sm text-error" role="alert">
                {serverError}
              </p>
            )}
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-secondary">
            New here?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
