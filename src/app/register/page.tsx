'use client';

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-muted px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-white font-bold">
                PD
              </span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create your ProdDash account</h1>
                <p className="text-sm text-secondary">Start managing products in minutes.</p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm text-secondary">Use at least 8 characters.</p>
              </div>
              {error && <p className="text-sm text-error md:col-span-2">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <Button type="submit" disabled={loading}>
                Create account
              </Button>
              <p className="text-sm text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
