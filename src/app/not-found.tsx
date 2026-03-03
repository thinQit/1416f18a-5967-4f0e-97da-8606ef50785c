export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <a className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white" href="/">
          Back to home
        </a>
      </div>
    </main>
  );
}
