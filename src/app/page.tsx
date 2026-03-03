import Link from "next/link";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Welcome to Storefront</h1>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Manage your products and inventory from a simple dashboard.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white"
          >
            View Products
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
