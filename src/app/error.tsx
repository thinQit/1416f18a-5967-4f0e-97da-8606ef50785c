'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container py-20">
      <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-secondary">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
