import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="text-primary hover:underline">Go back home</Link>
    </div>
  );
}
