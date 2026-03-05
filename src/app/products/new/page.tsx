'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import type { Product } from '@/types';

export default function AddProductPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '', quantity: '' });
  const [images, setImages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!token) {
      setError('You must be signed in to add products.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        images: images ? images.split(',').map((item) => item.trim()) : undefined
      };
      await api.post<{ product: Product }>('/api/products', payload, { token });
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 shadow-lg">
          <div className="mb-6 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Add a new product</h1>
            <p className="text-sm text-secondary">Capture product details and publish instantly to your catalog.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Product name"
              name="name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
              required
            />
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={4}
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', e.target.value)}
                required
              />
              <Input
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sku', e.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('quantity', e.target.value)}
              />
              <Input
                label="Image URLs (comma separated)"
                name="images"
                value={images}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImages(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving product...' : 'Create product'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
