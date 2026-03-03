export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Product Catalog Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              My App helps teams manage a beautiful, secure product catalog.
            </h1>
            <p className="text-lg text-secondary/70">
              Launch a streamlined product experience with secure authentication, fast CRUD workflows, and a modern listing dashboard. Built for small teams and scalable for growth.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/products"
                className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover"
              >
                Browse Products
              </a>
              <a
                href="/register"
                className="rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Create Account
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-secondary/70">
              <div>
                <p className="text-2xl font-semibold text-foreground">99.9%</p>
                <p>API uptime</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">15m</p>
                <p>Access token TTL</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">1-click</p>
                <p>Product publishing</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-lg">
            <div className="space-y-4">
              <div className="rounded-xl bg-primary/10 p-4">
                <p className="text-sm font-semibold text-primary">Live Catalog Snapshot</p>
                <p className="text-sm text-secondary/70">See current inventory, prices, and stock at a glance.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: 'Studio Backpack', price: '$96.00', qty: '42 in stock' },
                  { name: 'Evergreen Chair', price: '$240.00', qty: '18 in stock' },
                  { name: 'Aurora Lamp', price: '$68.00', qty: '60 in stock' },
                  { name: 'Nimbus Desk', price: '$320.00', qty: '9 in stock' }
                ].map((item) => (
                  <div key={item.name} className="rounded-xl border border-border p-4">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-secondary/70">{item.qty}</p>
                    <p className="mt-2 text-lg font-semibold text-primary">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to run a catalog</h2>
            <p className="mt-3 text-secondary/70">Designed around the core workflows in My App, from secure login to product moderation.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Secure Auth', text: 'JWT-based access with refresh tokens and role awareness built in.' },
              { title: 'Fast CRUD', text: 'Create, edit, and delete products with validated, structured APIs.' },
              { title: 'Smart Listings', text: 'Pagination and search keep product discovery quick and accurate.' },
              { title: 'Operational Insight', text: 'Health checks and logs for easy monitoring and scaling.' }
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-muted p-6">
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-secondary/70">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-border bg-white p-10 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Ready to build your catalog?</h3>
            <p className="mt-3 text-secondary/70">Start with My App and deliver a beautiful, reliable product experience in minutes.</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
            <a
              href="/products/new"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover"
            >
              Add a Product
            </a>
            <a
              href="/login"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-secondary/70 sm:flex-row">
          <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/products" className="hover:text-primary">Products</a>
            <a href="/register" className="hover:text-primary">Register</a>
            <a href="/login" className="hover:text-primary">Login</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
