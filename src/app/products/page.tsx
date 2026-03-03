'use client';

import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import Card, { CardContent } from '@/components/ui/Card';
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
              placeholder="Search by name"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPage(1);
                setQuery(event.target.value);
              }}
            />
            <Button href="/products/new">Add Product</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-error">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-lg font-semibold text-foreground">No products yet</p>
            <p className="text-sm text-secondary/70">Be the first to add a product to My App.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {product.quantity} in stock
                      </span>
                    </div>
                    <p className="text-sm text-secondary/70">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
                      <a className="text-sm font-semibold text-primary" href={`/products/${product.id}`}>
                        View details
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-secondary/70">
            Page {page} of {totalPages} • {total} total products
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
