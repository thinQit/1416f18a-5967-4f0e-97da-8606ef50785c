'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PaginatedResponse<Product>>("/api/products?page=1&per_page=5");
        setProducts(res?.items ?? []);
      } catch (err) {
        setError((err as Error).message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const lowStock = products.filter((product) => product.inventory < 5).length;

  return (
    <main className="bg-muted px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-secondary">Quick overview of your product catalog.</p>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-error">{error}</p>}

        {!loading && (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent>
                  <p className="text-sm text-secondary">Total products</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className="text-sm text-secondary">Low inventory</p>
                  <p className="text-2xl font-bold text-foreground">{lowStock}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className="text-sm text-secondary">Featured</p>
                  <p className="text-2xl font-bold text-foreground">{products[0]?.title || "—"}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Recent products</h2>
                  <Link href="/products/new" className="text-sm text-primary">
                    Add product
                  </Link>
                </div>
                <div className="space-y-3">
                  {products.length === 0 && <p className="text-secondary">No products yet.</p>}
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between rounded-md border border-border bg-white p-3">
                      <div>
                        <p className="font-semibold text-foreground">{product.title}</p>
                        <p className="text-sm text-secondary">${product.price.toFixed(2)}</p>
                      </div>
                      <Badge variant={product.inventory < 5 ? "warning" : "success"}>
                        {product.inventory < 5 ? "Low stock" : "In stock"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
