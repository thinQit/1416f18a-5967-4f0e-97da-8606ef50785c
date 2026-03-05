'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import Spinner from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/Card";

export default function ProductDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Product>(`/api/products/${id}`);
        setProduct(res ?? null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="px-6 py-16 text-error">{error}</div>;
  }

  if (!product) {
    return <div className="px-6 py-16 text-secondary">Product not found.</div>;
  }

  return (
    <main className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/3] rounded-md bg-muted flex items-center justify-center text-secondary overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <span>No image</span>
              )}
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="text-secondary">{product.description}</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-secondary">Price</p>
                  <p className="text-lg font-semibold text-foreground">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Inventory</p>
                  <p className="text-lg font-semibold text-foreground">{product.inventory}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-secondary">Added</p>
                <p className="text-sm font-semibold text-foreground">
                  {product.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
