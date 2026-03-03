'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-md px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Welcome back to ProdBoard</h1>
            <p className="text-sm text-foreground/70">Sign in to manage or browse products.</p>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="alex@company.com"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                required
              />
              {error && <p className="text-sm text-error">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-sm text-foreground/70">
                New to ProdBoard? <a className="text-primary hover:underline" href="/register">Create an account</a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
