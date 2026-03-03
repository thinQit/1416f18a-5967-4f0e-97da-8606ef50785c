export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-secondary/70">The page you are looking for does not exist.</p>
        <a href="/" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">
          Go home
        </a>
      </div>
    </main>
  );
}
