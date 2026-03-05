'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { ProductCard } from "@/components/ProductCard";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const load = async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: "12",
        q: query,
        min_price: minPrice || "0",
        max_price: maxPrice || "999999"
      });
      const res = await api.get<PaginatedResponse<Product>>(`/api/products?${params.toString()}`);
      setItems(res?.items ?? []);
      setTotal(res?.total ?? 0);
      setPage(res?.page ?? nextPage);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <main className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product catalog</h1>
            <p className="text-secondary">Search and filter products available in ProdDash.</p>
          </div>
          <Card>
            <CardContent className="flex flex-wrap gap-3">
              <Input
                placeholder="Search products"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
              <Input
                placeholder="Min price"
                type="number"
                value={minPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
              />
              <Input
                placeholder="Max price"
                type="number"
                value={maxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
              />
              <Button onClick={() => load(1)}>Search</Button>
            </CardContent>
          </Card>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-error">{error}</p>}
        {!loading && items.length === 0 && <p className="text-secondary">No products found.</p>}

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">Total products: {total}</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1 || loading} onClick={() => load(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" disabled={items.length < 12 || loading} onClick={() => load(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
