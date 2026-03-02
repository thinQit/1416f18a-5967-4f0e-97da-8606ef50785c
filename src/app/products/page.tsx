'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  inventoryCount: number;
  images: string[];
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('createdAt');
  const limit = 8;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!user) return;

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      const res = await api.get<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
      }>(`/api/products?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}&sort=${sort}`);

      if (res.error || !res.data) {
        const message = res.error || 'Unable to load products.';
        setError(message);
        toast(message, 'error');
        setItems([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setLoading(false);
    };

    loadProducts();
  }, [page, query, sort, toast, user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-secondary">
            Browse the catalog and track inventory levels.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => router.push('/products/new')}>Add product</Button>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description"
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-foreground">Sort by</label>
          <select
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-secondary">
          No products found. Adjust your search or add a new product.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-xs text-secondary">SKU: {item.sku}</p>
                  </div>
                  <Badge variant={item.inventoryCount > 0 ? 'success' : 'warning'}>
                    {item.inventoryCount > 0 ? 'In stock' : 'Low stock'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-40 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-md bg-muted text-sm text-secondary">
                    No image available
                  </div>
                )}
                <p className="text-sm text-secondary">{item.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                  <span className="text-secondary">
                    Added {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-secondary">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
