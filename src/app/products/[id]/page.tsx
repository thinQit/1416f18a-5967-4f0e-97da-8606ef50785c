'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0];
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Product>(`/api/products/${id}`);
        setProduct(response ?? null);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-muted py-16">
        <Spinner />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-muted py-16 text-center text-error">
        {error || "Product not found."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-4xl px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">{product.name}</h1>
            <p className="text-sm text-foreground/70">{product.category}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/70">{product.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-foreground/60">Price</p>
                <p className="text-lg font-semibold text-foreground">
                  {product.currency} {product.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Stock</p>
                <p className="text-lg font-semibold text-foreground">{product.stock}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Created</p>
                <p className="text-lg font-semibold text-foreground">
                  {product.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            {(product.images ?? []).length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {(product.images ?? []).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.name} image ${index + 1}`}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
