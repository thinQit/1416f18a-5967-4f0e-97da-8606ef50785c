import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

const primaryButtonClasses =
  'inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
const outlineButtonClasses =
  'inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">ShopFlow Commerce Suite</p>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              Manage products faster with a clean, secure catalog built for modern teams.
            </h1>
            <p className="text-lg text-secondary">
              ShopFlow delivers a lightweight product catalog and admin dashboard with JWT authentication, role-based access,
              and image-ready listings. Launch your catalog in minutes and scale with pagination and search.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className={primaryButtonClasses}>
                Browse Products
              </Link>
              <Link href="/register" className={outlineButtonClasses}>
                Create an Account
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-secondary">
              <div>
                <span className="block text-2xl font-bold text-foreground">99.9%</span>
                Reliable uptime
              </div>
              <div>
                <span className="block text-2xl font-bold text-foreground">1k+</span>
                Products indexed
              </div>
              <div>
                <span className="block text-2xl font-bold text-foreground">JWT</span>
                Secure sessions
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.jpg"
                alt="ShopFlow dashboard preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg md:block">
              Admin insights in real-time
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">Everything your catalog needs</h2>
            <p className="mt-3 text-secondary">
              Designed around the ShopFlow wireframes — modern UI, accessible components, and REST-ready endpoints.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Role-based admin control',
                description: 'Admins create, edit, and delete products with secure JWT-protected endpoints and 403 safeguards.'
              },
              {
                title: 'Search & pagination',
                description: 'Fast catalog browsing with case-insensitive search and page-based performance tuning.'
              },
              {
                title: 'Image-ready listings',
                description: 'Upload-ready product cards support optional images and clean, accessible layouts.'
              }
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold text-foreground">Built for operational clarity</h2>
              <p className="text-secondary">
                ShopFlow offers clean product detail pages, admin dashboards, and secure profile access so teams can ship updates
                confidently.
              </p>
              <ul className="space-y-3 text-sm text-secondary">
                <li>• Secure password hashing with bcryptjs and short-lived JWTs.</li>
                <li>• Product audit trails with timestamps and creator IDs.</li>
                <li>• Easy-to-extend upload pipeline for S3-compatible storage.</li>
              </ul>
              <Link href="/dashboard" className={primaryButtonClasses}>
                View Admin Dashboard
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/feature.jpg"
                alt="ShopFlow catalog management"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/cta.jpg" alt="ShopFlow call to action" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-secondary/70" />
            <div className="relative flex flex-col items-start gap-6 px-8 py-12 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold">Ready to launch ShopFlow?</h3>
                <p className="text-white/80">Create your admin account and start curating your catalog today.</p>
              </div>
              <Link href="/register" className={primaryButtonClasses}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-sm text-secondary">© 2024 ShopFlow. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-secondary">
            <Link href="/products">Catalog</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Create Account</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
