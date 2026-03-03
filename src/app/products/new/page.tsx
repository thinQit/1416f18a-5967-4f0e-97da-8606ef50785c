'use client';

import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export default function AddProductPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', images: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('Please log in to add a product.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: form.quantity ? Number(form.quantity) : 0,
        images: form.images ? form.images.split(',').map((url) => url.trim()).filter((url) => url.length > 0) : []
      };
      await api.post('/api/products', payload, token);
      setSuccess('Product created successfully.');
      router.push('/products');
    } catch (_error) {
      setError('Unable to create product. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>Add Product</CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <Input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                required
              />
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                required
              />
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
              />
              <Input
                name="images"
                placeholder="Image URLs (comma-separated)"
                value={form.images}
                onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-primary">{success}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Create product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
