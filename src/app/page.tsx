import Image from 'next/image';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Page() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              MerchMate Admin & Storefront
            </span>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              Run your product catalog with clarity, speed, and secure access.
            </h1>
            <p className="text-lg text-foreground/70">
              MerchMate is a lightweight admin & storefront dashboard built for modern teams. Manage products, track inventory, and onboard users
              with secure JWT-based authentication and a clean, responsive interface.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/register">Create your account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">View product listing</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
              <Image src="/images/hero.jpg" alt="MerchMate dashboard preview" width={1200} height={675} className="h-56 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold text-primary">Live inventory overview</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">Keep every SKU organized and in stock.</h3>
              </div>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Inventory Snapshot</h3>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Live</span>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Streetwear Hoodie', 'Canvas Tote', 'Enamel Mug'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{item}</p>
                      <p className="text-xs text-foreground/60">SKU MM-00{index + 1}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{24 - index * 5} in stock</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary">Why MerchMate</p>
              <h2 className="text-3xl font-bold text-foreground">Everything you need to manage products</h2>
              <p className="text-foreground/70">
                Purpose-built tools for merchandising teams and growing storefronts with secure access, fast catalog updates, and a clear view of
                inventory performance.
              </p>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <Image src="/images/feature.jpg" alt="Product management feature" width={1200} height={675} className="h-56 w-full object-cover" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: 'Secure Auth', desc: 'JWT access + refresh tokens with protected routes and session handling.' },
                { title: 'Product CRUD', desc: 'Add, edit, delete, and manage SKU, stock, and pricing in minutes.' },
                { title: 'Smart Listings', desc: 'Paginated product catalog with search by name or SKU.' },
                { title: 'Media Uploads', desc: 'Upload product images and keep the catalog consistent across devices.' }
              ].map(feature => (
                <Card key={feature.title}>
                  <CardContent className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-foreground/70">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { label: 'Products managed', value: '2,400+' },
              { label: 'Avg. onboarding time', value: '12 min' },
              { label: 'Uptime monitored', value: '99.9%' }
            ].map(stat => (
              <Card key={stat.label} className="text-center">
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-2 text-sm text-foreground/70">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 rounded-2xl bg-primary/10 p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Ready to streamline your merchandise workflow?</h2>
              <p className="text-foreground/70">Start with MerchMate and keep your catalog tidy, secure, and ready to sell.</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/register">Get started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <Image src="/images/cta.jpg" alt="MerchMate call to action" width={1200} height={675} className="h-56 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-foreground/70 md:flex-row">
          <p>© {new Date().getFullYear()} MerchMate. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/register" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
