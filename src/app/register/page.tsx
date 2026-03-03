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

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt?: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const next: { name?: string; email?: string; password?: string } = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password.trim() || form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: 'name' | 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', form);
      if (!response.data || response.error) {
        setServerError(response.error || 'Registration failed.');
        return;
      }
      localStorage.setItem('token', response.data.token);
      login({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        createdAt: response.data.user.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast('Account created successfully!', 'success');
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
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-secondary">Manage products and access the dashboard with ease.</p>
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <h2 className="text-lg font-semibold">Sign up</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              autoComplete="name"
              required
            />
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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="new-password"
              required
            />
            {serverError && (
              <p className="text-sm text-error" role="alert">
                {serverError}
              </p>
            )}
            <Button type="submit" fullWidth loading={loading}>
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
