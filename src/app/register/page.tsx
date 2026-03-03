'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';

interface RegisterResponse {
  id: string;
  email: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: 'name' | 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const res = await api.post<RegisterResponse>('/api/auth/register', {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    });
    setLoading(false);

    if (res.error || !res.data) {
      setError(res.error || 'Registration failed.');
      return;
    }

    toast('Registration successful. Please log in.', 'success');
    router.push('/login');
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">Register to manage products and access the dashboard.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange('name')} required />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange('email')} required />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange('password')}
          required
          helperText="Minimum 8 characters."
        />
        {error && (
          <p className="text-sm text-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          Register
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
