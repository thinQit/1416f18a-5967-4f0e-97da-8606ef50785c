'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { PaginatedResponse, Product } from '@/types';
import { formatDate } from '@/lib/utils';

const DEFAULT_META = { page: 1, limit: 6, total: 0 };

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&limit=6&q=${encodeURIComponent(search)}`
      );
      setData(
        response ?? {
          items: [],
          meta: DEFAULT_META
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const totalPages = useMemo(() => {
    if (!data?.meta) return 1;
    return Math.max(1, Math.ceil(data.meta.total / data.meta.limit));
  }, [data]);

  return (
    <div className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-white p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900">Product Listing</h1>
            <p className="text-sm text-slate-500">Browse the latest products in the catalog.</p>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {error ? <p className="mb-6 text-sm text-red-500">{error}</p> : null}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Spinner className="h-4 w-4" />
            Loading products...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.items?.length ? (
              data.items.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
                      <Badge>{product.currency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>${product.price.toFixed(2)}</span>
                      <span>Updated {formatDate(product.updatedAt)}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="text-sm font-medium text-primary hover:underline">
                      View details
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-sm text-slate-500">No products found.</CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
