'use client';

import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Product, PaginatedResponse } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}`
      );
      const items = response?.items ?? [];
      setProducts(items);
      setTotal(response?.total ?? 0);
    } catch (_error) {
      setError('Unable to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, query]);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Listing</h1>
            <p className="text-sm text-secondary/70">Browse public products and explore the catalog.</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <Input
              name="search"
              placeholder="Search products"
              value={query}
              onChange={(event) => {
                setPage(1);
                setQuery(event.target.value);
              }}
            />
            <Button href="/products/new">Add Product</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-white p-10">
            <Spinner />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-secondary/70 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                    <Button href={`/products/${product.id}`} size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-secondary/70">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
