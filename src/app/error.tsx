'use client';

export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-secondary/70">Please refresh the page or try again later.</p>
      </div>
    </main>
  );
}
