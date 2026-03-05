'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

export default function ProductDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? idParam : idParam?.[0] || '';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Product not found.');
        setLoading(false);
        return;
      }
      setError('');
      setLoading(true);
      try {
        const response = await api.get<Product>(`/api/products/${id}`);
        if (!response) {
          setError('Unable to load product.');
          setProduct(null);
        } else if (!response.ok) {
          setError(response.error || 'Unable to load product.');
          setProduct(null);
        } else {
          setProduct(response.data);
        }
      } catch (_error) {
        setError('Unable to load product.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-muted">
        <div className="flex justify-center py-20">
          <Spinner className="h-10 w-10" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Card>
            <CardContent>
              <p className="text-sm text-error">{error}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Card>
            <CardContent>
              <p className="text-sm text-secondary">Product not found.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Card>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-secondary">No image</div>
              )}
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-secondary">{product.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </Badge>
              </div>
              <p className="text-xs text-secondary">
                Last updated {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
