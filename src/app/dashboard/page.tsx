'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { PaginatedResponse, Product } from '@/types';

export default function DashboardPage() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PaginatedResponse<Product>>('/api/products?page=1&limit=1')
      .then((data) => setTotal(data?.meta?.total ?? 0))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Overview of your ShopFlow catalog and quick actions.</p>
        </div>

        {loading && <Spinner label="Loading dashboard" />}

        {error && <p className="text-sm text-error">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="text-3xl font-bold text-slate-900">{total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="text-sm text-slate-500">Active Listings</p>
                <p className="text-3xl font-bold text-slate-900">{total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="text-sm text-slate-500">Quick Actions</p>
                <div className="flex flex-col gap-2">
                  <Link href="/products/new">
                    <Button variant="primary">Add Product</Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline">View Storefront</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
