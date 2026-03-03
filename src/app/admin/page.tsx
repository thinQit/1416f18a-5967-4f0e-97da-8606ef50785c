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
      const res = await api.get<ProductResponse>('/api/products?page=1&limit=100');
      if (res.error || !res.data) {
        setError(res.error || 'Unable to load dashboard.');
        setLoading(false);
        return;
      }
      const items = res.data.items ?? [];
      setTotal(res.data.total ?? 0);
      setLowStock(items.filter(item => item.inventory < 5));
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of product inventory and alerts.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="space-y-3">
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
            <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
              Refresh dashboard
            </Link>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Total Products</h2>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">No low stock items.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {lowStock.map(item => (
                    <li key={item.id} className="flex items-center justify-between">
                      <span>{item.title}</span>
                      <Badge variant="warning">{item.inventory} left</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-wrap gap-4">
          <Link href="/products/new" className="text-sm font-medium text-primary hover:underline">
            Add Product
          </Link>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            Manage Products
          </Link>
        </div>
      )}
    </div>
  );
}
