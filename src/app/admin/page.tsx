'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
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
      const res = await api.get<ProductResponse>('/api/products?page=1&limit=100');
      if (res.error || !res.data) {
        setError(res.error || 'Unable to load dashboard.');
        setLoading(false);
        return;
      }
      const items = res.data.items ?? [];
      setTotal(res.data.total ?? 0);
      setLowStock(items.filter((item) => item.inventory < 5));
      setLoading(false);
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
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of catalog inventory and low-stock alerts.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-white p-10">
            <Spinner />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>Total products</CardHeader>
              <CardContent className="text-3xl font-semibold">{total}</CardContent>
            </Card>
            <Card>
              <CardHeader>Low stock items</CardHeader>
              <CardContent className="space-y-2">
                {lowStock.length === 0 ? (
                  <p className="text-sm text-muted-foreground">All items are sufficiently stocked.</p>
                ) : (
                  <ul className="space-y-2">
                    {lowStock.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.title}</span>
                        <Badge>{item.inventory} left</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
