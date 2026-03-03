'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form.name, form.email, form.password);
      router.push("/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-16">
      <div className="mx-auto max-w-md px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Create your ProdBoard account</h1>
            <p className="text-sm text-foreground/70">Manage products securely with role-based access.</p>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent className="space-y-4">
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Alex Johnson"
                required
              />
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
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-foreground/70">
                Already have an account? <a className="text-primary hover:underline" href="/login">Sign in</a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
