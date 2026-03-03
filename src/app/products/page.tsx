'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 10;

type SortOption = "createdAt:desc" | "createdAt:asc" | "price:asc" | "price:desc";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("createdAt:desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&pageSize=${PAGE_SIZE}&q=${encodeURIComponent(query)}&sort=${sort}`
      );
      setData(response ?? null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load products";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort]);

  const items = data?.items ?? [];
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <main className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product listing</h1>
            <p className="text-sm text-slate-600">Search, sort, and manage Productly items.</p>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
            <Input
              label="Search"
              name="q"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  setPage(1);
                  fetchProducts();
                }
              }}
              placeholder="Search products"
            />
            <div className="flex flex-col gap-2 text-sm">
              <label className="text-sm font-medium text-slate-700" htmlFor="sort">
                Sort by
              </label>
              <select
                id="sort"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={sort}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  setSort(event.target.value as SortOption);
                  setPage(1);
                }}
              >
                <option value="createdAt:desc">Newest</option>
                <option value="createdAt:asc">Oldest</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
              </select>
            </div>
            <Button
              variant="outline"
              className="self-end md:self-auto"
              onClick={() => {
                setPage(1);
                fetchProducts();
              }}
            >
              Search
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {error && <p className="mt-6 text-sm text-error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="mt-8 text-sm text-slate-600">No products found. Try adjusting your search.</p>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
                    <Badge variant={product.active ? "success" : "warning"}>
                      {product.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">SKU: {product.sku || "N/A"}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">${product.price}</span>
                    <span className="text-slate-500">Stock: {product.stock ?? 0}</span>
                  </div>
                  <a href={`/products/${product.id}`} className="mt-4 inline-flex text-sm font-semibold text-primary">
                    View details
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data && totalPages > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button
              className="rounded-md border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {data.page} of {totalPages}
            </span>
            <button
              className="rounded-md border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
