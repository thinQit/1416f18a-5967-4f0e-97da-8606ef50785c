import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              ShopFlow Admin + Storefront Starter
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Launch your product catalog and admin workflows in days, not weeks.
            </h1>
            <p className="text-lg text-slate-600">
              ShopFlow is a TypeScript-first starter for authentication, product management, and a modern storefront UI. Create, edit,
              and ship product experiences with secure JWT auth, a clean API, and a responsive frontend.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  Browse Products
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                JWT-secured APIs
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                SQLite + Prisma
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero.jpg"
              alt="ShopFlow storefront hero"
              width={1200}
              height={675}
              className="rounded-2xl border border-slate-200 object-cover shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need to run a product catalog</h2>
              <p className="text-slate-600">
                ShopFlow stitches together authentication, product APIs, and UI screens so you can focus on your business logic.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { title: 'Secure Auth', text: 'JWT access tokens, bcrypt hashing, and user profile endpoints.' },
                  { title: 'Admin Tools', text: 'Role-aware product management with create/edit/delete flows.' },
                  { title: 'Search + Pagination', text: 'Built-in query support for fast, responsive storefronts.' },
                  { title: 'Developer Friendly', text: 'TypeScript types, Zod validation, and Prisma ORM.' }
                ].map((feature) => (
                  <Card key={feature.title} className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{feature.text}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/feature.jpg"
                alt="ShopFlow product management"
                width={1200}
                height={675}
                className="rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { value: '200ms', label: 'Target API response time' },
              { value: 'WCAG 2.1', label: 'Accessibility compliance' },
              { value: '24/7', label: 'Health monitoring ready' }
            ].map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to build your storefront with ShopFlow?</h2>
            <p className="max-w-2xl text-slate-200">
              Start with a complete auth + product management foundation and customize the experience for your team and customers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Create an Account
                </Button>
              </Link>
              <Link href="/products/new">
                <Button variant="outline" size="lg">
                  Add a Product
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/cta.jpg"
              alt="ShopFlow call to action"
              width={1200}
              height={675}
              className="rounded-2xl border border-white/10 object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">ShopFlow</p>
            <p className="text-sm text-slate-500">Admin + storefront starter for modern product teams.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/products">Products</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
