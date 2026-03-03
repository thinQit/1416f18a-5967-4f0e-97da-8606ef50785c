'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  images?: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stock: '',
  });
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const next: { name?: string; price?: string } = {};
    if (!form.name.trim()) next.name = 'Product name is required.';
    if (!form.price.trim() || Number.isNaN(Number(form.price))) next.price = 'Valid price is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    const payload: ProductPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      sku: form.sku.trim() || undefined,
      stock: form.stock.trim() ? Number(form.stock) : undefined,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setServerError('You must be logged in to add a product.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unable to create product.' }));
        setServerError(err.error || 'Unable to create product.');
        return;
      }

      toast('Product created successfully!', 'success');
      router.push('/products');
    } catch (_error) {
      setServerError('Unable to create product.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
        <p className="text-sm text-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Sign in required</h1>
        <p className="text-sm text-secondary">Please log in to add a new product.</p>
        <Button asChild>
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Add a new product</h1>
        <p className="mt-1 text-sm text-secondary">Fill in the details to list a new product.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <h2 className="text-lg font-semibold">Product details</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Product name"
              name="name"
              placeholder="Wireless headphones"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              required
            />
            <Input
              label="Description"
              name="description"
              placeholder="Describe the product"
              value={form.description}
              onChange={handleChange('description')}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Price"
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange('price')}
                error={errors.price}
                required
              />
              <Input
                label="Stock"
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange('stock')}
              />
            </div>
            <Input
              label="SKU"
              name="sku"
              placeholder="Optional SKU"
              value={form.sku}
              onChange={handleChange('sku')}
            />
            {serverError && (
              <p className="text-sm text-error" role="alert">
                {serverError}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" loading={loading}>
                Create product
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/products')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
