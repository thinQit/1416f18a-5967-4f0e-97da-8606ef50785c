'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku?: string | null;
  stock: number;
  images?: string[];
  createdAt?: string;
  createdBy?: string;
}

interface ProductListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Product[];
}

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductListResponse | null>(null);

  const totalPages = useMemo(() => {
    const total = data?.total ?? 0;
    return total > 0 ? Math.ceil(total / pageSize) : 1;
  }, [data?.total, pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (query.trim()) params.set('q', query.trim());
      const response = await api.get<ProductListResponse>(`/api/products?${params.toString()}`);
      if (!response.data || response.error) {
        setError(response.error || 'Unable to load products.');
        setData(null);
        return;
      }
      setData(response.data);
    } catch (_error) {
      setError('Unable to load products.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, [page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    void fetchProducts();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-secondary">Browse the latest inventory and pricing.</p>
        </div>
        <Button asChild>
          <Link href="/products/new">Add product</Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <form className="flex flex-col gap-3 md:flex-row md:items-center" onSubmit={handleSearch}>
            <div className="flex-1">
              <Input
                label="Search"
                name="search"
                placeholder="Search by name or description"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">Search</Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <div className="rounded-md border border-error/30 bg-red-50 p-4 text-sm text-error" role="alert">
              {error}
            </div>
          ) : (data?.items?.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary">
              No products found. Try a different search or add a new product.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data?.items?.map(item => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm text-secondary">{item.description}</p>
                    </div>
                    <Badge variant={item.stock > 0 ? 'success' : 'warning'}>
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-secondary">
                    <span className="font-medium text-foreground">{formatCurrency(item.price)}</span>
                    {item.sku && <span>SKU: {item.sku}</span>}
                    <span>
                      Added {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-secondary">
              Showing {(data?.items?.length ?? 0)} of {data?.total ?? 0} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
