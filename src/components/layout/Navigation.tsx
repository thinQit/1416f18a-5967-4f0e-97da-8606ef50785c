'use client';

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
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const authLinks = routes.filter((route) => route.href === '/register' || route.href === '/login');
  const primaryLinks = routes.filter((route) => !['/register', '/login'].includes(route.href));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#ff7a7a] text-lg font-bold text-white shadow-md">
            M
          </div>
          <span className="text-lg font-semibold text-foreground">My App</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {primaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-secondary/70'
              )}
            >
              {link.label}
            </a>
          ))}
          {!isAuthenticated &&
            authLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition',
                  link.href === '/register' ? 'text-primary' : 'text-secondary/70'
                )}
              >
                {link.label}
              </a>
            ))}
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-secondary/70 hover:text-primary"
            >
              Logout
            </button>
          )}
        </nav>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-secondary/70'
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!isAuthenticated &&
              authLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-secondary/70 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left text-sm font-semibold text-secondary/70 hover:text-primary"
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
