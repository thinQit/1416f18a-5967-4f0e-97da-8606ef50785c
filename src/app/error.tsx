'use client';

import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-secondary">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
