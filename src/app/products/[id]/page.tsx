'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import ProductForm, { ProductFormValues } from "@/components/product/ProductForm";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import Spinner from "@/components/ui/Spinner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = typeof params?.id === "string" ? params.id : params?.id?.[0];

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Product>(`/api/products/${id}`);
      setProduct(response ?? null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        sku: values.sku || undefined,
        stock: values.stock ? Number(values.stock) : undefined,
        images: values.images ? values.images.split(",").map((item) => item.trim()) : []
      };
      await api.put(`/api/products/${productId}`, payload, token ?? undefined);
      router.push("/products");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </main>
    );
  }

  return (
    <main className="bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Edit product</h1>
            <p className="text-sm text-slate-600">Update product details and inventory.</p>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-sm text-error">{error}</p>}
            {product ? (
              <ProductForm initialValues={product} onSubmit={handleSubmit} loading={loading} />
            ) : (
              <p className="text-sm text-slate-600">Product not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
