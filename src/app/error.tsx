'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
      <p className="mt-2 text-foreground/70">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-lg bg-primary px-4 py-2 text-white">Try again</button>
    </div>
  );
}
