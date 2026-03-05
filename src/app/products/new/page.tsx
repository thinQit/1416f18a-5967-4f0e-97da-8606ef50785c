'use client';

import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AddProductPage() {
  const [form, setForm] = useState({ title: "", description: "", price: "", inventory: "", image_url: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/products", {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        inventory: form.inventory ? Number(form.inventory) : 0,
        image_url: form.image_url || undefined
      });
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-muted px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">Add a new product</h1>
            <p className="text-secondary">Provide the product details to publish to the catalog.</p>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Input
                label="Inventory"
                name="inventory"
                type="number"
                value={form.inventory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, inventory: e.target.value })}
              />
              <Input
                label="Image URL"
                name="image_url"
                value={form.image_url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, image_url: e.target.value })}
              />
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              {error && <p className="text-sm text-error md:col-span-2">{error}</p>}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                Save product
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
