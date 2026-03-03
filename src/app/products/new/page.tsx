'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function AddProductPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    stock: "",
    category: "",
    images: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Please sign in to add products.");
      return;
    }

    setLoading(true);
    try {
      const images = form.images
        ? form.images.split(",").map(item => item.trim()).filter(Boolean)
        : [];

      await api.post(
        "/api/products",
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          currency: form.currency,
          stock: Number(form.stock),
          category: form.category,
          images
        },
        token
      );
      router.push("/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Add a new product</h1>
            <p className="text-sm text-foreground/70">Admins can manage inventory from this form.</p>
          </CardHeader>
          {!user ? (
            <CardContent>
              <p className="text-sm text-foreground/70">
                Please <Link href="/login" className="text-primary hover:underline">sign in</Link> to add products.
              </p>
            </CardContent>
          ) : !isAdmin ? (
            <CardContent>
              <p className="text-sm text-error">You need admin access to add products.</p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent className="space-y-4">
                <Input label="Product name" value={form.name} onChange={handleChange("name")} required />
                <Input label="Description" value={form.description} onChange={handleChange("description")} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Price" type="number" step="0.01" value={form.price} onChange={handleChange("price")} required />
                  <Input label="Currency" value={form.currency} onChange={handleChange("currency")} required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Stock" type="number" value={form.stock} onChange={handleChange("stock")} required />
                  <Input label="Category" value={form.category} onChange={handleChange("category")} required />
                </div>
                <Input
                  label="Image URLs (comma separated)"
                  value={form.images}
                  onChange={handleChange("images")}
                  placeholder="https://..."
                />
                {error && <p className="text-sm text-error">{error}</p>}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Create product"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
