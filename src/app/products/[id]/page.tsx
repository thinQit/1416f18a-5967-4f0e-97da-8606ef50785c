'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const productId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      const res = await api.get<Product>(`/api/products/${productId}`);
      if (res.error || !res.data) {
        setError(res.error || 'Unable to load product.');
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(res.data);
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!productId) return;
    setDeleting(true);
    setDeleteError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setDeleteError(err.error || 'Failed to delete product.');
        setDeleting(false);
        return;
      }

      setDeleting(false);
      setDeleteOpen(false);
      router.push('/products');
    } catch (_error) {
      setDeleting(false);
      setDeleteError('Network error while deleting.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            Back to products
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Product not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="text-sm">Inventory: {product.inventory}</p>
          {product.imageUrl ? (
            <a
              href={product.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              View image
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No image provided.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
          Back to products
        </Link>
        {isAdmin && (
          <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete Product
          </Button>
        )}
      </div>

      <Modal
        isOpen={deleteOpen}
        title="Delete product?"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteError(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" loading={deleting} onClick={handleDelete}>
              Confirm delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The product will be permanently removed from the catalog.
        </p>
        {deleteError && (
          <p className="mt-3 text-sm text-error" role="alert">
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  );
}
