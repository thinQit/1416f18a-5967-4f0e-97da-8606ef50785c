'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.post<{
      user: { id: string; name: string; email: string };
      token?: string;
    }>('/api/auth/register', { name, email, password });

    setLoading(false);

    if (res.error || !res.data) {
      const message = res.error || 'Registration failed. Please try again.';
      setError(message);
      toast(message, 'error');
      return;
    }

    if (res.data.token) {
      login({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem('token', res.data.token);
    }

    toast('Account created successfully!', 'success');
    router.push('/products');
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-sm text-secondary">
        Register to start managing products and inventory.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" loading={loading} fullWidth>
          Create account
        </Button>
      </form>
    </div>
  );
}
