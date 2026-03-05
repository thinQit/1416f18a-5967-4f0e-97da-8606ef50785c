'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface UploadResponse {
  url?: string;
  message?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imagePreview) {
      return undefined;
    }
    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError('Select an image to upload.');
      return;
    }
    setUploading(true);
    setUploadError('');
    setUploadMessage('');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const token = window.localStorage.getItem('shopflow_token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });
      const payload = (await response.json().catch(() => ({}))) as UploadResponse;
      if (!response.ok || !payload.url) {
        setUploadError(payload.message || 'Unable to upload image.');
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: payload.url || '' }));
      setUploadMessage('Image uploaded successfully.');
    } catch (_error) {
      setUploadError('Unable to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required.');
      return;
    }

    const priceValue = Number(form.price);
    const stockValue = Number(form.stock);
    if (Number.isNaN(priceValue) || Number.isNaN(stockValue)) {
      setError('Price and stock must be valid numbers.');
      return;
    }

    setLoading(true);

    const response = await api.post<Product>('/api/products', {
      name: form.name,
      description: form.description,
      price: priceValue,
      stock: stockValue,
      imageUrl: form.imageUrl || undefined
    });

    if (!response || !response.ok) {
      setError(response?.error || 'Unable to create product');
      setLoading(false);
      return;
    }

    router.push('/products');
  };

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">Add a new product</h1>
            <p className="text-sm text-secondary">Admins can create catalog entries with pricing and stock details.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Product name"
                name="name"
                placeholder="Modern Desk Lamp"
                value={form.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              <Input
                label="Description"
                name="description"
                placeholder="Describe the product"
                value={form.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, description: event.target.value })
                }
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  value={form.price}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  required
                />
                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="120"
                  value={form.stock}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, stock: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-3">
                <Input
                  label="Image URL"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, imageUrl: event.target.value })
                  }
                />
                <div className="rounded-lg border border-dashed border-border bg-white p-4">
                  <p className="text-sm font-medium text-foreground">Upload an image</p>
                  <p className="text-xs text-secondary">Supported formats: JPG, PNG. Optional.</p>
                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0] ?? null;
                        setImageFile(file);
                        setUploadMessage('');
                        setUploadError('');
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        } else {
                          setImagePreview('');
                        }
                      }}
                      className="text-sm text-secondary"
                    />
                    <Button type="button" variant="outline" onClick={handleUpload} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload image'}
                    </Button>
                  </div>
                  {imagePreview && (
                    <div className="mt-4 overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Selected product" className="h-40 w-full object-cover" />
                    </div>
                  )}
                  {uploadMessage && <p className="mt-2 text-xs text-success">{uploadMessage}</p>}
                  {uploadError && <p className="mt-2 text-xs text-error">{uploadError}</p>}
                </div>
              </div>
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Create product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
