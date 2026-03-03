'use client';

import { useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
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
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Add Product
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Publish a new product to My App.</h1>
          <p className="text-secondary/70">
            Share product details, pricing, and inventory so customers can find what they need fast.
          </p>
          <div className="rounded-xl border border-border bg-white p-4 text-sm text-secondary/70">
            Tip: Add multiple image URLs separated by commas to highlight different angles.
          </div>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Product Details</h2>
            <p className="text-sm text-secondary/70">All fields marked required must be completed.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Product Name"
                name="name"
                value={form.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              <Input
                label="Description"
                name="description"
                value={form.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, description: event.target.value })
                }
                required
              />
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, quantity: event.target.value })
                }
              />
              <Input
                label="Image URLs (comma separated)"
                name="images"
                value={form.images}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, images: event.target.value })
                }
              />
              {error && <p className="text-sm text-error">{error}</p>}
              {success && <p className="text-sm text-success">{success}</p>}
              <Button type="submit" isLoading={loading} className="w-full">
                Save Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
