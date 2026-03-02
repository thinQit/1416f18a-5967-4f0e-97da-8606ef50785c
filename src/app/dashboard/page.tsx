'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/products');
    }
  }, [authLoading, isAdmin, router, user]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const loadStats = async () => {
      setLoading(true);
      setError('');

      const res = await api.get<DashboardStats>('/api/dashboard');

      if (res.error || !res.data) {
        const message = res.error || 'Unable to load dashboard stats.';
        setError(message);
        toast(message, 'error');
        setLoading(false);
        return;
      }

      setStats(res.data);
      setLoading(false);
    };

    loadStats();
  }, [isAdmin, toast, user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="text-sm text-secondary">
          Overview of key metrics across the platform.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">
          {error}
        </div>
      )}

      {!error && stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Total users</h3>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-secondary">Registered accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Total products</h3>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
              <p className="text-sm text-secondary">Active listings</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
