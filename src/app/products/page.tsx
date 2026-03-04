'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product, PaginatedResponse } from '@/types';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.get<PaginatedResponse<Product>>(
          `/api/products?page=${page}&limit=8&search=${encodeURIComponent(search)}`
        );
        setItems(data?.items ?? []);
        setTotal(data?.total ?? 0);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [page, search, isAuthenticated]);

  const totalPages = Math.max(1, Math.ceil(total / 8));

  return (
    <div className="min-h-screen bg-muted py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Product Listing</h1>
            <p className="text-sm text-foreground/70">Search, filter, and manage every item in your catalog.</p>
          </div>
          <Button onClick={() => router.push('/products/new')}>Add product</Button>
        </div>
        <div className="flex items-center gap-4">
          <Input
            label="Search"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search by name or SKU"
          />
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Spinner /> Loading products...
          </div>
        )}
        {error && <p className="text-sm text-error">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <Card>
            <CardContent className="text-center text-sm text-foreground/70">
              No products found. Try adjusting your search or add a new product.
            </CardContent>
          </Card>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={product.imageUrl || '/images/feature.jpg'}
                  alt={product.name}
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                  <Badge variant={product.stock > 0 ? 'success' : 'error'}>{product.stock} in stock</Badge>
                </div>
                <p className="text-sm text-foreground/60">SKU {product.sku}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/70">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/products/${product.id}`)}>
                    View & edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-foreground/70">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
