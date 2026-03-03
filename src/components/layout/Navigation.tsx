'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          ProductManager
        </Link>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted"
          aria-label="Toggle navigation"
          onClick={() => setOpen(v => !v)}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
        </button>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm text-foreground hover:text-primary">Products</Link>
          {isAdmin && (
            <Link href="/dashboard" className="text-sm text-foreground hover:text-primary">Dashboard</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">{user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-foreground hover:text-primary">Login</Link>
              <Link href="/register" className="text-sm text-foreground hover:text-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-2">
          <Link href="/products" className="block text-sm text-foreground hover:text-primary">Products</Link>
          {isAdmin && (
            <Link href="/dashboard" className="block text-sm text-foreground hover:text-primary">Dashboard</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-secondary">{user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-2">
              <Link href="/login" className="text-sm text-foreground hover:text-primary">Login</Link>
              <Link href="/register" className="text-sm text-foreground hover:text-primary">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navigation;
