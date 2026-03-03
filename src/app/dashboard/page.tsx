'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
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

  if (!isAdmin && !authLoading) {
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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of your store activity.</p>
          </div>
          <Button asChild>
            <Link href="/products/new">Add product</Link>
          </Button>
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Total products</h2>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{data?.totalProducts ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Total users</h2>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{data?.totalUsers ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <h2 className="text-lg font-semibold">Recent users</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data?.recentUsers ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent users yet.</p>
                ) : (
                  data?.recentUsers?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge>{user.role}</Badge>
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
