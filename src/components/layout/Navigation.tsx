'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/admin', label: 'Admin' }
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, loading, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">ProductManager</Link>
        <button
          type="button"
          className="sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
        </button>
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium hover:text-primary',
                pathname === link.href && 'text-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
          {!loading && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
              <Link href="/register" className="text-sm font-medium hover:text-primary">Register</Link>
            </div>
          )}
          {!loading && isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user?.name}</span>
              <Button type="button" size="sm" variant="ghost" onClick={logout}>Logout</Button>
              {isAdmin && <Link href="/products/new" className="text-sm font-medium hover:text-primary">Add Product</Link>}
            </div>
          )}
        </nav>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('text-sm font-medium', pathname === link.href && 'text-primary')}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loading && !isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="text-sm font-medium" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="text-sm font-medium" onClick={() => setOpen(false)}>Register</Link>
              </div>
            )}
            {!loading && isAuthenticated && (
              <div className="flex flex-col gap-2">
                <span className="text-sm">{user?.name}</span>
                <Button type="button" size="sm" variant="ghost" onClick={logout}>Logout</Button>
                {isAdmin && <Link href="/products/new" className="text-sm font-medium" onClick={() => setOpen(false)}>Add Product</Link>}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
