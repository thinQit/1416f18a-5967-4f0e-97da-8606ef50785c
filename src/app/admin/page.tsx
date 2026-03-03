'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Product {
  id: string;
  title: string;
  inventory: number;
}

interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [total, setTotal] = useState(0);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<ProductResponse>('/api/products?page=1&limit=100');
        if (!data) {
          throw new Error('Unable to load dashboard.');
        }
        const items = data.items ?? [];
        setTotal(data.total ?? 0);
        setLowStock(items.filter((item) => item.inventory < 5));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="space-y-3">
          <h1 className="text-xl font-semibold">Admin access required</h1>
          <p className="text-sm text-muted-foreground">You need admin permissions to view this dashboard.</p>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            Back to products
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of inventory and store activity.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Total products</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  Loading totals...
                </div>
              ) : (
                <p className="text-3xl font-semibold">{total}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Low stock alerts</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  Checking inventory...
                </div>
              ) : lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">All products have healthy stock levels.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {lowStock.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                      <Badge variant="destructive">{item.inventory} left</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </main>
  );
}
