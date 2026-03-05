import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-sm text-secondary">The page you are looking for doesn’t exist or has moved.</p>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </main>
  );
}
