import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-secondary">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
