import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Product Manager</h1>
        <p className="text-secondary">
          Manage your catalog, inventory, and admin insights in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">Secure access</h2>
            <p className="text-sm text-secondary">
              Register and sign in to access the full product suite.
            </p>
            <Button>
              <Link href="/register">Get started</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">Product listings</h2>
            <p className="text-sm text-secondary">
              Browse products with search, sorting, and pagination.
            </p>
            <Button variant="outline">
              <Link href="/products">View products</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">Admin insights</h2>
            <p className="text-sm text-secondary">
              Track user and product totals in the dashboard.
            </p>
            <Button variant="ghost">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
