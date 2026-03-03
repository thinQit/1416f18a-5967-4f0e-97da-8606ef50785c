'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';

interface DashboardResponse {
  totalUsers: number;
  totalProducts: number;
  recentProducts: Array<{
    id: string;
    name: string;
    price: number;
    createdAt?: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
  }>;
}

export default function DashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!isAdmin()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Missing authentication token.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/dashboard/metrics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Unable to load metrics.' }));
          setError(err.error || 'Unable to load metrics.');
          setData(null);
          return;
        }

        const payload = (await response.json()) as DashboardResponse;
        setData(payload);
      } catch (_error) {
        setError('Unable to load metrics.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      void fetchMetrics();
    }
  }, [authLoading, isAdmin]);

  if (authLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Admin access required</h1>
        <p className="text-sm text-secondary">You do not have permission to view the dashboard.</p>
        <Button asChild>
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Admin dashboard</h1>
        <p className="mt-1 text-sm text-secondary">Quick overview of platform activity.</p>
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <div className="rounded-md border border-error/30 bg-red-50 p-4 text-sm text-error" role="alert">
          {error}
        </div>
      ) : !data ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary">
          No metrics available.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-sm font-medium text-secondary">Total users</h2>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{data.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-sm font-medium text-secondary">Total products</h2>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{data.totalProducts}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold">Recent products</h2>
              </CardHeader>
              <CardContent>
                {(data.recentProducts?.length ?? 0) === 0 ? (
                  <p className="text-sm text-secondary">No recent products.</p>
                ) : (
                  <ul className="space-y-3">
                    {data.recentProducts?.map(product => (
                      <li key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-secondary">
                            Added {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold">Recent users</h2>
              </CardHeader>
              <CardContent>
                {(data.recentUsers?.length ?? 0) === 0 ? (
                  <p className="text-sm text-secondary">No recent users.</p>
                ) : (
                  <ul className="space-y-3">
                    {data.recentUsers?.map(user => (
                      <li key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-secondary">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'success' : 'default'}>
                          {user.role}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
