'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/providers/AuthProvider';
import type { Product, PaginatedResponse } from '@/types';

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const limit = 6;

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}&sort=${sort}`,
        { token: token || undefined }
      );
      const items = data?.items ?? [];
      setProducts(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort]);

  const filteredMessage = useMemo(() => (query ? `Results for “${query}”` : 'All products'), [query]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-muted py-10">
      <div className="container space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product catalog</h1>
            <p className="text-sm text-secondary">{filteredMessage}</p>
          </div>
          <a
            href="/products/new"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Add product
          </a>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
          <div className="flex-1">
            <Input
              label="Search"
              name="search"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search by name"
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="text-sm font-medium text-foreground" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              value={sort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <Button type="submit" className="mt-6 sm:mt-0">
            Search
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-sm text-error">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-secondary">No products found. Try adjusting your search.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-secondary">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-foreground">${product.price.toFixed(2)}</p>
                    <Badge variant={product.quantity && product.quantity > 0 ? 'success' : 'warning'}>
                      {product.quantity && product.quantity > 0 ? 'In stock' : 'Out of stock'}
                    </Badge>
                  </div>
                  <a href={`/products/${product.id}`} className="text-sm font-semibold text-primary hover:text-primary-hover">
                    View details →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-secondary">Page {page}</span>
          <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
