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
            <p className="text-slate-600">Browse the latest ShopFlow catalog with search and pagination.</p>
          </div>
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            <div className="min-w-[220px] flex-1">
              <Input
                label="Search products"
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                placeholder="Search by name or description"
              />
            </div>
            <Button type="submit" variant="primary" className="mt-6 h-10">
              Search
            </Button>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Spinner label="Loading products" />
          </div>
        )}

        {error && <p className="text-center text-sm text-error">{error}</p>}

        {!loading && data?.items.length === 0 && (
          <p className="text-center text-sm text-slate-600">No products found. Try adjusting your search.</p>
        )}

        {!loading && data && data.items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                      <p className="text-xs text-slate-500">
                        Added {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
                      </p>
                    </div>
                    <Badge variant={product.stock && product.stock > 0 ? 'success' : 'warning'}>
                      {product.stock && product.stock > 0 ? 'In Stock' : 'Low Stock'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">{product.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900">
                      {product.currency || 'USD'} {product.price.toFixed(2)}
                    </span>
                    <Link href={`/products/${product.id}`} className="text-sm font-semibold text-primary">
                      View details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
