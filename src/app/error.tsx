'use client';

import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-600">We encountered an unexpected error. Please try again.</p>
      </div>
    </main>
  );
}
