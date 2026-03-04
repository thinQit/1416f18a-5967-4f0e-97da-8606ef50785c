'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

interface UploadResponse {
  url: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '', stock: '', imageUrl: '' });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  const handleUpload = async (): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!res.ok) return null;
    const data = (await res.json()) as UploadResponse;
    return data?.url ?? null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const uploadedUrl = await handleUpload();
      await api.post('/api/products', {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku,
        stock: Number(form.stock),
        imageUrl: uploadedUrl || form.imageUrl
      });
      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-foreground">Add a new product</h1>
        <p className="mt-2 text-sm text-foreground/70">Capture details like price, SKU, and inventory levels.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              placeholder="https://"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)}
            />
            {file && (
              <div className="overflow-hidden rounded-lg border border-border">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded preview"
                  width={1200}
                  height={675}
                  className="h-40 w-full object-cover"
                />
              </div>
            )}
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                Saving...
              </span>
            ) : (
              'Save product'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
