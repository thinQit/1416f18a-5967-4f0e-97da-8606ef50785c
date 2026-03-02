'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  inventoryCount: number;
  images: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [inventoryCount, setInventoryCount] = useState('');
  const [images, setImages] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/products');
    }
  }, [authLoading, isAdmin, router, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const imageList = images
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const res = await api.post<ProductResponse>('/api/products', {
      name,
      description,
      price: Number(price),
      sku,
      inventoryCount: Number(inventoryCount),
      images: imageList
    });

    setLoading(false);

    if (res.error || !res.data) {
      const message = res.error || 'Unable to create product.';
      setError(message);
      toast(message, 'error');
      return;
    }

    toast('Product created successfully!', 'success');
    router.push('/products');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add product</h1>
        <p className="text-sm text-secondary">
          Provide product details to add it to the catalog.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="Inventory count"
            type="number"
            value={inventoryCount}
            onChange={(e) => setInventoryCount(e.target.value)}
            required
          />
        </div>
        <Input
          label="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          required
        />
        <Input
          label="Image URLs"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          helperText="Separate multiple URLs with commas."
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" loading={loading} fullWidth>
          Create product
        </Button>
      </form>
    </div>
  );
}
