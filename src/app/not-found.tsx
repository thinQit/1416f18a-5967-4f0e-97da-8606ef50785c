export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-muted text-center">
      <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="text-foreground/70">The page you are looking for doesn&apos;t exist.</p>
      <a href="/" className="text-primary hover:underline">Go back home</a>
    </div>
  );
}
