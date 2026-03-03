'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  stock?: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<ProductPayload>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    stock: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ProductPayload) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'price' || field === 'stock' ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('shopflow_token') || undefined;
      await api.post('/api/products', form, token);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add Product</h1>
          <p className="text-slate-600">Create a new catalog item for ShopFlow.</p>
          {user && <p className="text-xs text-slate-500">Signed in as {user.email}</p>}
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Product Details</h2>
            <p className="text-sm text-slate-500">Fill in the information below to publish the product.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input label="Product name" value={form.name} onChange={handleChange('name')} required />
              </div>
              <div className="md:col-span-2">
                <Input label="Description" value={form.description} onChange={handleChange('description')} />
              </div>
              <Input label="Price" type="number" step="0.01" value={form.price} onChange={handleChange('price')} required />
              <Input label="Currency" value={form.currency} onChange={handleChange('currency')} />
              <Input label="Stock" type="number" value={form.stock} onChange={handleChange('stock')} />
              <div className="md:col-span-2">
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Creating product...' : 'Create product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
