'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '', quantity: '' });

  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const loadProduct = async () => {
    if (!productId) {
      setError('Product not found.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api.get<{ product: Product }>(`/api/products/${productId}`);
      const fetchedProduct = data?.product;
      if (!fetchedProduct) {
        setError('Product not found.');
        setProduct(null);
        return;
      }
      setProduct(fetchedProduct);
      setForm({
        name: fetchedProduct.name,
        description: fetchedProduct.description,
        price: fetchedProduct.price.toString(),
        sku: fetchedProduct.sku || '',
        quantity: fetchedProduct.quantity?.toString() || ''
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const handleUpdate = async () => {
    if (!productId) {
      setError('Product not found.');
      return;
    }
    if (!token) {
      setError('You must be signed in to edit products.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined
      };
      const data = await api.put<{ product: Product }>(`/api/products/${productId}`, payload, { token });
      const updated = data?.product;
      if (!updated) {
        setError('Failed to update product.');
        return;
      }
      setProduct(updated);
      setEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) {
      setError('Product not found.');
      return;
    }
    if (!token) {
      setError('You must be signed in to delete products.');
      return;
    }
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await api.delete<{ success: boolean }>(`/api/products/${productId}`, { token });
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const canManage = user && product && (user.role === 'admin' || user.id === product.createdBy);

  return (
    <main className="min-h-screen bg-muted py-12">
      <div className="container">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-sm text-error">{error}</p>
        ) : product ? (
          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <p className="mt-2 text-sm text-secondary">{product.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xl font-semibold text-foreground">${product.price.toFixed(2)}</span>
                  <Badge variant={product.quantity && product.quantity > 0 ? 'success' : 'warning'}>
                    {product.quantity && product.quantity > 0 ? 'In stock' : 'Out of stock'}
                  </Badge>
                </div>
              </div>
              {canManage ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing((prev) => !prev)}>
                    {editing ? 'Cancel' : 'Edit'}
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
              ) : null}
            </div>

            {editing && canManage ? (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Edit product</h2>
                <Input
                  label="Product name"
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    rows={4}
                    value={form.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Price"
                    type="number"
                    value={form.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                  <Input
                    label="SKU"
                    value={form.sku}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((prev) => ({ ...prev, sku: e.target.value }))
                    }
                  />
                </div>
                <Input
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                />
                <Button onClick={handleUpdate} disabled={loading}>Save changes</Button>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-secondary">Product not found.</p>
        )}
      </div>
    </main>
  );
}
