'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { PaginatedResponse, Product } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

const outlineButtonClasses =
  'inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default function ProductListingPage() {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get<PaginatedResponse<Product>>(
          `/api/products?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}`
        );
        if (!response) {
          setError('Unable to load products.');
          setData(null);
        } else if (!response.ok) {
          setError(response.error || 'Unable to load products.');
          setData(null);
        } else {
          setData(response.data);
        }
      } catch (_error) {
        setError('Unable to load products.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, query]);

  const totalPages = data ? Math.max(1, Math.ceil(data.meta.total / data.meta.pageSize)) : 1;

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Catalog</h1>
            <p className="text-sm text-secondary">Browse the latest inventory with search and pagination.</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="Search"
              name="search"
              placeholder="Search products by name"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPage(1);
                setQuery(event.target.value);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-error">
            {error}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((product) => (
              <Card key={product.id}>
                <CardContent className="space-y-4">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-secondary">No image</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-secondary line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
                    <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  <Link href={`/products/${product.id}`} className={outlineButtonClasses}>
                    View details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-secondary">
            No products found. Try a different search.
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <span className="text-sm text-secondary">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
