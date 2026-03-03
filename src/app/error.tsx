'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-slate-600">{error.message}</p>
      <Link href="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}
