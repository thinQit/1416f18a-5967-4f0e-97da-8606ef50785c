'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/providers/AuthProvider';

interface ProductPayload {
  title: string;
  description: string;
  price: number;
  inventory: number;
  imageUrl?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', inventory: '', imageUrl: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(form.price);
    const inventoryValue = Number(form.inventory);

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    if (Number.isNaN(inventoryValue) || inventoryValue < 0) {
      setError('Inventory must be zero or greater.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    const payload: ProductPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceValue,
      inventory: inventoryValue,
      imageUrl: form.imageUrl.trim() || undefined
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setError(err.error || 'Unable to create product.');
        setLoading(false);
        return;
      }

      toast('Product created', 'success');
      setLoading(false);
      router.push('/products');
    } catch (_error) {
      setLoading(false);
      setError('Network error while creating product.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="space-y-3">
          <h1 className="text-xl font-semibold">Admin access required</h1>
          <p className="text-sm text-muted-foreground">You need admin permissions to add products.</p>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Go to login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">Create a new catalog entry.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={form.title} onChange={handleChange('title')} required />
        <Input label="Description" value={form.description} onChange={handleChange('description')} required />
        <Input
          label="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange('price')}
          required
        />
        <Input
          label="Inventory"
          type="number"
          value={form.inventory}
          onChange={handleChange('inventory')}
          required
        />
        <Input label="Image URL" value={form.imageUrl} onChange={handleChange('imageUrl')} placeholder="https://" />
        {error && (
          <p className="text-sm text-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading} fullWidth>
          Add Product
        </Button>
      </form>
    </div>
  );
}
