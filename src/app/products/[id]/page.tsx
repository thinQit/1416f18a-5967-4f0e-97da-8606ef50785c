'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await api.get<Product>(`/api/products/${productId}`);
        if (response) {
          setProduct(response);
        } else {
          setError('Product not found.');
        }
      } catch (_error) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <p className="mt-2 text-secondary/70">{error || 'The product you are looking for does not exist.'}</p>
          <Button href="/products" className="mt-6">Back to Products</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <p className="mt-2 text-secondary/70">{product.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="rounded-xl border border-border bg-muted px-4 py-3">
                  <p className="text-sm text-secondary/70">Price</p>
                  <p className="text-lg font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted px-4 py-3">
                  <p className="text-sm text-secondary/70">Quantity</p>
                  <p className="text-lg font-semibold text-foreground">{product.quantity} in stock</p>
                </div>
              </div>
              {Array.isArray(product.images) && product.images.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Images</h2>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {product.images.map((url, index) => (
                      <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-border bg-muted">
                        <img src={url} alt={`${product.name} ${index + 1}`} className="h-48 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
