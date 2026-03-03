'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
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
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin overview</h1>
          <p className="text-sm text-muted-foreground">Keep an eye on low stock items and inventory totals.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Total products</h2>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Low stock items</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStock.length === 0 ? (
                  <p className="text-sm text-muted-foreground">All products have healthy stock levels.</p>
                ) : (
                  lowStock.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.title}</span>
                      <Badge variant="destructive">{item.inventory} left</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
