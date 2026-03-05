'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-sm text-secondary">We were unable to load this page. Try again in a moment.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
