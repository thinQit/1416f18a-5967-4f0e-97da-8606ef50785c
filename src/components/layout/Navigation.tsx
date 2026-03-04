'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

const routes = [
  { href: '/register', label: 'Register' },
  { href: '/login', label: 'Login' },
  { href: '/products', label: 'Products' },
  { href: '/products/new', label: 'Add Product' }
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navLinks = routes.filter(route => {
    if (!isAuthenticated && route.href.startsWith('/products')) return false;
    if (isAuthenticated && (route.href === '/login' || route.href === '/register')) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white font-bold">
            MM
          </div>
          <span className="text-lg font-semibold text-foreground">MerchMate</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium text-foreground/80 hover:text-foreground',
                pathname === link.href && 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => logout()}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-border p-2"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-5 bg-foreground"></span>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-sm font-medium text-foreground/80 text-left"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
