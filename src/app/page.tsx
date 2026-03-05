import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Page() {
  return (
    <main className="bg-white">
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary">ProdDash</p>
            <h1 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">
              Run your product operations with clarity and speed.
            </h1>
            <p className="mt-4 text-base text-secondary">
              ProdDash brings lightweight product management, secure access, and fast listings together for small e-commerce teams.
              Launch inventory workflows in minutes and keep stakeholders aligned.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg">Explore Products</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero.jpg"
              alt="Product dashboard overview"
              width={1200}
              height={675}
              className="rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-white p-4 shadow-md md:block">
              <p className="text-sm font-semibold text-foreground">Trusted by agile product teams</p>
              <p className="text-xs text-secondary">Secure access + inventory workflows</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <Image
                src="/images/feature.jpg"
                alt="Product listing preview"
                width={1200}
                height={675}
                className="rounded-2xl object-cover shadow"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Built for modern inventory teams</h2>
              <p className="mt-3 text-secondary">Everything you need to go from idea to live catalog.</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Product CRUD", desc: "Manage titles, descriptions, pricing, and inventory with an authenticated workflow." },
                  { title: "Insightful dashboard", desc: "Track your catalog health and quickly access top products." },
                  { title: "API-first", desc: "Built with robust endpoints ready for integrations and automation." },
                  { title: "Image ready", desc: "Upload product images with validation and hosted URLs." }
                ].map((feature) => (
                  <Card key={feature.title}>
                    <CardContent>
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm text-secondary">{feature.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-white p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Ready to get your catalog in shape?</h2>
              <p className="mt-3 text-secondary">Start with ProdDash today and bring order to your product workflow.</p>
              <div className="mt-6">
                <Link href="/register">
                  <Button size="lg">Start free</Button>
                </Link>
              </div>
            </div>
            <div>
              <Image
                src="/images/cta.jpg"
                alt="Team collaboration"
                width={1200}
                height={675}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-secondary md:flex-row">
          <div className="font-semibold text-foreground">ProdDash</div>
          <div className="flex gap-4">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-primary">
              Sign In
            </Link>
          </div>
          <div>© {new Date().getFullYear()} ProdDash. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
