'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&limit=${limit}&category=${encodeURIComponent(category)}`
      );
      setProducts(response?.items ?? []);
      setTotal(response?.meta?.total ?? 0);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <main className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Product Listing</h1>
            <p className="text-foreground/70">Browse the latest inventory from ProdBoard.</p>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Filter by category"
              value={category}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCategory(event.target.value)}
              placeholder="e.g. Accessories"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-foreground/70">No products found.</div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-foreground/70">{product.category}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/70 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                      {product.currency} {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-foreground/60">Stock: {product.stock}</span>
                  </div>
                  <Link href={`/products/${product.id}`} className="text-primary text-sm font-medium">
                    View details →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
            Previous
          </Button>
          <span className="text-sm text-foreground/70">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
