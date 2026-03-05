'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/api';
import type { PaginatedResponse, Product } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('shopflow_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get<PaginatedResponse<Product>>('/api/products?page=1&pageSize=5');
        if (!response) {
          setError('Unable to load dashboard data.');
          setData(null);
        } else if (!response.ok) {
          setError(response.error || 'Unable to load dashboard data.');
          setData(null);
        } else {
          setData(response.data);
        }
      } catch (_error) {
        setError('Unable to load dashboard data.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-secondary">
            Overview for {user?.name || 'Admin'} — role: {user?.role || 'user'}.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-error">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">Latest products</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.items.length ? (
                  data.items.map((product) => (
                    <div key={product.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-secondary">${product.price.toFixed(2)}</p>
                      </div>
                      <Badge variant={product.stock > 0 ? 'success' : 'error'}>{product.stock} stock</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary">No products available yet.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">Account summary</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-secondary">
                <p>Email: {user?.email || 'N/A'}</p>
                <p>Role: {user?.role || 'N/A'}</p>
                <p>Access: {user?.role === 'admin' ? 'Full catalog control' : 'Read-only'}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
