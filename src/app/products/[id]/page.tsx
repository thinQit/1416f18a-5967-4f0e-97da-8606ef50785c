'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const productId = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params.id]);
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '', stock: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError('');
      try {
        const data = await api.get<Product>(`/api/products/${productId}`);
        if (!data) return;
        setProduct(data);
        setForm({
          name: data?.name ?? '',
          description: data?.description ?? '',
          price: data?.price?.toString() ?? '',
          sku: data?.sku ?? '',
          stock: data?.stock?.toString() ?? '',
          imageUrl: data?.imageUrl ?? ''
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId) return;
    setError('');
    try {
      await api.put(`/api/products/${productId}`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku,
        stock: Number(form.stock),
        imageUrl: form.imageUrl
      });
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/products/${productId}`);
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-foreground">Product detail</h1>
        <p className="mt-2 text-sm text-foreground/70">Edit or remove this product from your catalog.</p>
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
            <Spinner /> Loading product...
          </div>
        )}
        {error && <p className="mt-4 text-sm text-error">{error}</p>}
        {!loading && !error && !product && (
          <p className="mt-6 text-sm text-foreground/70">Product not found.</p>
        )}
        {product && (
          <form className="mt-6 space-y-4" onSubmit={handleSave}>
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src={form.imageUrl || '/images/feature.jpg'}
                alt={form.name}
                width={1200}
                height={675}
                className="h-48 w-full object-cover"
              />
            </div>
            <Input
              label="Product name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Price"
                type="number"
                value={form.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Input
                label="SKU"
                value={form.sku}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, sku: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, stock: e.target.value })}
                required
              />
              <Input
                label="Image URL"
                value={form.imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>Delete product</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
