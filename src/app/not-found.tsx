export default function NotFound() {
  return (
    <main className="container py-20">
      <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-secondary">The page you are looking for does not exist.</p>
        <a href="/" className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Back to home
        </a>
      </div>
    </main>
  );
}
