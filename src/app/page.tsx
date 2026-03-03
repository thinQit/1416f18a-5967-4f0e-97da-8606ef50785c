import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-white via-white to-primary/10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Productly</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Modern product management for fast-moving teams
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Productly is a lightweight dashboard to register, authenticate, and manage product listings with pricing,
              inventory, and images. Built for clarity, speed, and role-based access.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="/register">Get started</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/products">View products</a>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-slate-500">API uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">20+</p>
                <p className="text-slate-500">Fields tracked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">RBAC</p>
                <p className="text-slate-500">Built-in roles</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
            <Image
              src="/images/hero.jpg"
              alt="Productly dashboard overview"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Everything your product catalog needs</h2>
            <p className="mt-3 text-slate-600">Manage products, inventory, and media with clean APIs and a friendly UI.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "JWT Authentication",
                body: "Secure registration and login with access tokens and role-based access controls."
              },
              {
                title: "Product CRUD",
                body: "Create, update, and delete products with pricing, SKU, stock, and status."
              },
              {
                title: "Search & Pagination",
                body: "Fast product discovery with filtering, sorting, and paginated endpoints."
              },
              {
                title: "Image Management",
                body: "Upload and manage multiple product images with optimized URLs."
              }
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <Image
              src="/images/feature.jpg"
              alt="Product insights overview"
              width={1200}
              height={675}
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Unified visibility</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">Track pricing, inventory, and images in one view</h2>
            <p className="mt-4 text-slate-600">
              Productly keeps your catalog organized with streamlined forms, real-time visibility, and role-based actions.
              Empower product owners and admins to ship updates confidently.
            </p>
            <div className="mt-6 grid gap-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p>Structured product data with SKU, stock, and active status.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p>Image uploads and URL tracking for every listing.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p>API-first integrations for storefronts and analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Start managing products today</h2>
            <p className="mt-3 text-sm text-white/80">
              Create your account, add products, and keep inventory aligned across your team.
            </p>
            <Button asChild variant="secondary" className="mt-6 bg-white text-primary hover:bg-slate-100">
              <a href="/register">Create an account</a>
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/20">
            <Image
              src="/images/cta.jpg"
              alt="Team collaborating on product planning"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-400">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">Productly</p>
              <p className="mt-2 text-slate-400">Lightweight product management for modern teams.</p>
            </div>
            <div className="flex gap-6">
              <a className="hover:text-white" href="/products">
                Products
              </a>
              <a className="hover:text-white" href="/login">
                Login
              </a>
              <a className="hover:text-white" href="/register">
                Register
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500">© 2024 Productly. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
