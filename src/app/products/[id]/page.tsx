'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, currency: '', stock: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    api
      .get<Product>(`/api/products/${productId}`)
      .then((data) => {
        if (!data?.id) {
          setProduct(null);
          return;
        }
        setProduct(data);
        setForm({
          name: data.name,
          description: data.description || '',
          price: data.price,
          currency: data.currency || 'USD',
          stock: data.stock || 0
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'price' || field === 'stock' ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('shopflow_token') || undefined;
      const updated = await api.patch<Product>(`/api/products/${productId}`, form, token);
      if (updated?.id) {
        setProduct(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('shopflow_token') || undefined;
      await api.delete(`/api/products/${productId}`, token);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading product" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-600">Update product information or adjust inventory.</p>
          </div>
          <Badge variant={product.isActive ? 'success' : 'warning'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Edit Product</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Name" value={form.name} onChange={handleChange('name')} />
              <Input label="Currency" value={form.currency} onChange={handleChange('currency')} />
              <div className="md:col-span-2">
                <Input label="Description" value={form.description} onChange={handleChange('description')} />
              </div>
              <Input label="Price" type="number" step="0.01" value={form.price} onChange={handleChange('price')} />
              <Input label="Stock" type="number" value={form.stock} onChange={handleChange('stock')} />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Button onClick={handleDelete} variant="destructive" disabled={saving}>
                Delete product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
