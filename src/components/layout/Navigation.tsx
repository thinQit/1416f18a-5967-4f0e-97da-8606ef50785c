'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

interface NavLink {
  href: string;
  label: string;
}

export function Navigation() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const links: NavLink[] = [
    { href: '/products', label: 'Products' },
    { href: '/products/new', label: 'Add Product' },
    { href: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold">Product Manager</Link>
        <button
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-2">
              <Link className="text-sm text-foreground hover:text-primary" href="/login">Login</Link>
              <Link className="text-sm text-foreground hover:text-primary" href="/register">Register</Link>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.name}</span>
              {isAdmin && <span className="rounded bg-muted px-2 py-1 text-xs">Admin</span>}
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-foreground hover:text-primary">
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-2">
                <Link className="text-sm text-foreground hover:text-primary" href="/login">Login</Link>
                <Link className="text-sm text-foreground hover:text-primary" href="/register">Register</Link>
              </div>
            )}
            {user && (
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
