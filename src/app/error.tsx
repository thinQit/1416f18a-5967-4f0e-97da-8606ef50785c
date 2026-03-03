'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted text-center">
      <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
      <p className="text-foreground/70">Please try again or return later.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
