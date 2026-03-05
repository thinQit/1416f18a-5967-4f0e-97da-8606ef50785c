'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navRoutes = [
  { href: '/products', label: 'Products' },
  { href: '/products/new', label: 'Add Product' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow">P</span>
          <span>Prodly</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navRoutes
            .filter((route) => !route.href.includes(':'))
            .map((route) => (
              <Link key={route.href} href={route.href} className="text-sm font-medium text-secondary hover:text-primary">
                {route.label}
              </Link>
            ))}
        </nav>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-secondary md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Menu</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <div className="container flex flex-col gap-3 pb-4">
          {navRoutes
            .filter((route) => !route.href.includes(':'))
            .map((route) => (
              <Link key={route.href} href={route.href} className="text-sm font-medium text-secondary hover:text-primary">
                {route.label}
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
