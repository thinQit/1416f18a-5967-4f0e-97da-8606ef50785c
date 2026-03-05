'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/products', label: 'Products' },
  { href: '/products/new', label: 'Add Product' },
  { href: '/dashboard', label: 'Dashboard' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold shadow">
            SF
          </div>
          <Link href="/" className="text-lg font-semibold text-foreground">
            ShopFlow
          </Link>
        </div>
        <button
          aria-label="Toggle navigation"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          <span className="text-sm font-semibold">Menu</span>
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-foreground hover:text-primary">
              {route.label}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary">
              Sign In
            </Link>
            <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      <div className={cn('md:hidden border-t border-border bg-white', open ? 'block' : 'hidden')}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-foreground hover:text-primary">
              {route.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary">
            Sign In
          </Link>
          <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover text-center">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
