'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  imageUrl?: string | null;
}

interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (nextPage: number, query: string) => {
    setLoading(true);
    setError(null);
    const res = await api.get<ProductResponse>(
      `/api/products?page=${nextPage}&limit=${limit}&q=${encodeURIComponent(query)}`
    );

    if (res.error || !res.data) {
      setError(res.error || 'Unable to load products.');
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setProducts(res.data.items ?? []);
    setTotal(res.data.total ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1, q);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:max-w-md">
          <Input
            label="Search products"
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            placeholder="Search by title"
          />
          <Button type="button" onClick={handleSearch}>
            Search
          </Button>
        </div>
        {isAdmin && (
          <Link href="/products/new" className="text-sm font-medium text-primary hover:underline">
            + Add Product
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="space-y-3">
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
            <Button type="button" variant="outline" onClick={() => fetchProducts(page, q)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && products.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No products found. Try a different search.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">{product.inventory} left</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                <Link href={`/products/${product.id}`} className="text-sm font-medium text-primary hover:underline">
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
