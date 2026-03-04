export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h2 className="text-3xl font-semibold text-foreground">Page not found</h2>
      <p className="mt-2 text-foreground/70">The page you are looking for doesn’t exist.</p>
      <a href="/" className="mt-4 rounded-lg bg-primary px-4 py-2 text-white">Back home</a>
    </div>
  );
}
