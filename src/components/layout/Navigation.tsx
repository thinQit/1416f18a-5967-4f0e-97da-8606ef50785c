'use client';

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const routes = [
  { href: "/products", label: "Products" },
  { href: "/products/new", label: "Add Product" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-white shadow">
            PD
          </span>
          <span>ProdDash</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="text-sm font-medium text-foreground hover:text-primary">
              {route.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary">Sign In</Link>
              <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Sign Up</Link>
            </div>
          ) : (
            <button
              onClick={() => logout()}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Log Out
            </button>
          )}
        </nav>
        <button
          aria-label="Toggle navigation"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-foreground mb-1"></span>
          <span className="block h-0.5 w-6 bg-foreground mb-1"></span>
          <span className="block h-0.5 w-6 bg-foreground"></span>
        </button>
      </div>
      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <div className="space-y-2 border-t border-border bg-white px-4 py-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="block text-sm font-medium text-foreground">
              {route.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-foreground">Sign In</Link>
              <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Sign Up</Link>
            </div>
          ) : (
            <button
              onClick={() => logout()}
              className="w-full rounded-md border border-border px-4 py-2 text-left text-sm font-semibold text-foreground"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
