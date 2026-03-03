'use client';

import { useState } from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import ProductForm, { ProductFormValues } from "@/components/product/ProductForm";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ProductFormValues) => {
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
      await api.post("/api/products", payload, token ?? undefined);
      router.push("/products");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Add a new product</h1>
            <p className="text-sm text-slate-600">Fill in product details, pricing, and image links.</p>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-sm text-error">{error}</p>}
            <ProductForm onSubmit={handleSubmit} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
