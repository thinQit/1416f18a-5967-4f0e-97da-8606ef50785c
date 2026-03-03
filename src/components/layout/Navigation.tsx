'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

const navRoutes = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/products/new', label: 'Add Product' },
  { href: '/dashboard', label: 'Dashboard' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const filteredRoutes = navRoutes.filter((route) => !route.href.includes(':'));

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
            SF
          </span>
          <span className="text-lg font-semibold text-slate-900">ShopFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {filteredRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {route.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Link>
              <Link href="/register" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Sign Up</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          )}
        </nav>
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center rounded-md border border-slate-200 p-2 md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-slate-700" />
            <span className="h-0.5 w-5 bg-slate-700" />
            <span className="h-0.5 w-5 bg-slate-700" />
          </div>
        </button>
      </div>
      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <div className="space-y-3 border-t bg-white px-6 py-4">
          {filteredRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="block text-sm font-medium text-slate-600">
              {route.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-600">Sign In</Link>
              <Link href="/register" className="text-sm font-semibold text-primary">Sign Up</Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-sm font-semibold text-slate-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
