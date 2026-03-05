import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="bg-muted">
      <section className="relative overflow-hidden bg-white">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Prodly Product Dashboard
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Build and manage your product catalog with secure, fast workflows.
            </h1>
            <p className="text-lg text-secondary">
              Prodly brings together registration, authentication, and a modern product catalog so teams can create, edit, and publish items with confidence. Keep your inventory organized, searchable, and always accessible.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover"
              >
                Get started free
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-base font-semibold text-foreground transition hover:border-primary"
              >
                Browse catalog
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-sm text-secondary">API uptime with built-in health checks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">15m</p>
                <p className="text-sm text-secondary">JWT access tokens for secure sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1-click</p>
                <p className="text-sm text-secondary">Create, edit, and publish products</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-lg">
            <Image
              src="/images/hero.jpg"
              alt="Prodly dashboard preview"
              width={1200}
              height={675}
              className="h-auto w-full rounded-xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Everything teams need to launch products faster</h2>
            <p className="mt-3 text-base text-secondary">Purpose-built features for catalog teams, merchandisers, and operations managers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Secure auth', text: 'JWT sessions, hashed passwords, and role-based access for protected updates.' },
              { title: 'Product creation', text: 'Capture names, descriptions, SKUs, pricing, and rich media in one flow.' },
              { title: 'Smart search', text: 'Search and sort by name or price with paginated API responses.' },
              { title: 'Operational insights', text: 'Track inventory quantity and update products with full audit-ready logs.' }
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-secondary">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-border bg-muted p-4 shadow">
            <Image
              src="/images/feature.jpg"
              alt="Prodly feature preview"
              width={1200}
              height={675}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-foreground">Designed for modern teams, ready for scale</h2>
            <p className="text-base text-secondary">
              Prodly pairs a Next.js 14 interface with a Prisma-backed API for speed and reliability. Start on SQLite locally and upgrade to Postgres when you are ready to scale.
            </p>
            <ul className="space-y-3 text-sm text-secondary">
              <li>• Health endpoint and structured logging for observability.</li>
              <li>• Accessible form layouts with clear focus states.</li>
              <li>• Ready for image uploads and CDN-backed delivery.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-white">
        <div className="container grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold">Ready to launch your catalog?</h2>
            <p className="mt-2 text-sm text-white/80">Create your Prodly workspace and ship products in minutes.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <Image
              src="/images/cta.jpg"
              alt="Product launch preview"
              width={1200}
              height={675}
              className="h-auto w-full rounded-xl object-cover"
            />
            <a
              href="/register"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm transition hover:bg-white/90"
            >
              Create your account
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-white py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-secondary md:flex-row">
          <p>© {new Date().getFullYear()} Prodly. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/products" className="hover:text-primary">Products</a>
            <a href="/login" className="hover:text-primary">Login</a>
            <a href="/register" className="hover:text-primary">Register</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
