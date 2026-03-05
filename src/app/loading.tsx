import { Spinner } from '@/components/ui/Spinner';

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-muted">
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10" />
      </div>
    </main>
  );
}
