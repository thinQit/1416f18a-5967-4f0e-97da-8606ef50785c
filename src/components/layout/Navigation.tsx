'use client';

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/products/add", label: "Add Product" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const filteredLinks = navLinks.filter((link) => {
    if (isAuthenticated && (link.href === "/login" || link.href === "/register")) {
      return false;
    }
    return true;
  });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold shadow">
            P
          </div>
          <span className="text-lg font-semibold text-slate-900">Productly</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {filteredLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={logout} aria-label="Logout">
              Logout
            </Button>
          )}
        </nav>
        <button
          className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="h-4 w-5 space-y-1">
            <span className="block h-0.5 w-full bg-slate-700" />
            <span className="block h-0.5 w-full bg-slate-700" />
            <span className="block h-0.5 w-full bg-slate-700" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
