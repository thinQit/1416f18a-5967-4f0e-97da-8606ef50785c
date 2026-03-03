'use client';

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products/new", label: "Add Product" },
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Sign Up" }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = routes.filter(route => !route.href.includes(":") && route.href !== "/products/:id");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-semibold shadow">
            PB
          </span>
          <span className="text-lg font-semibold text-foreground">ProdBoard</span>
        </Link>
        <button
          type="button"
          className="md:hidden rounded-md border border-border p-2"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="block h-0.5 w-6 bg-foreground mb-1" />
          <span className="block h-0.5 w-6 bg-foreground mb-1" />
          <span className="block h-0.5 w-6 bg-foreground" />
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(route => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              {route.label}
            </Link>
          ))}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/70">Hi, {user?.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <nav className="px-6 pb-4 flex flex-col gap-3">
          {navItems.map(route => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              {route.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
