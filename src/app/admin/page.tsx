'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of current inventory and alerts.</p>
        </header>

        {loading && (
          <Card>
            <CardContent className="flex items-center gap-3 py-6">
              <Spinner />
              <span className="text-sm text-muted-foreground">Loading dashboard data...</span>
            </CardContent>
          </Card>
        )}

        {error && !loading && (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Total products</h2>
                <p className="text-sm text-muted-foreground">All active listings</p>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold">{total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Low stock alerts</h2>
                <p className="text-sm text-muted-foreground">Products with inventory below 5</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStock.length === 0 && <p className="text-sm text-muted-foreground">No low stock items.</p>}
                {lowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.title}</span>
                    <Badge variant="destructive">{item.inventory} left</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
