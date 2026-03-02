import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <Link className="text-primary hover:underline" href="/">Go back home</Link>
    </div>
  );
}
