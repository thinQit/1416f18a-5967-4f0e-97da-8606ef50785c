'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
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
      if (!isAdmin) {
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
            Authorization: `Bearer ${token}`
          }
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

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <Card>
          <CardContent className="space-y-3">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="text-sm text-muted-foreground">You need admin permissions to view this dashboard.</p>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              Back to products
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of platform activity.</p>
          </div>
          <Button href="/products/new">Add product</Button>
        </div>

        {error ? (
          <Card>
            <CardContent className="text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>Total users</CardHeader>
              <CardContent className="text-3xl font-semibold">{data?.totalUsers ?? 0}</CardContent>
            </Card>
            <Card>
              <CardHeader>Total products</CardHeader>
              <CardContent className="text-3xl font-semibold">{data?.totalProducts ?? 0}</CardContent>
            </Card>
            <Card>
              <CardHeader>Recent users</CardHeader>
              <CardContent className="space-y-2">
                {data?.recentUsers?.length ? (
                  <ul className="space-y-2">
                    {data.recentUsers.map((user) => (
                      <li key={user.id} className="flex items-center justify-between text-sm">
                        <span>{user.name}</span>
                        <Badge>{user.role}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent users.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>Recent products</CardHeader>
              <CardContent className="space-y-2">
                {data?.recentProducts?.length ? (
                  <ul className="space-y-2">
                    {data.recentProducts.map((product) => (
                      <li key={product.id} className="flex items-center justify-between text-sm">
                        <span>{product.name}</span>
                        <span>${product.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent products.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
