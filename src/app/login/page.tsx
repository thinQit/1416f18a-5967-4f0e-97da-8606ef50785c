'use client';

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface LoginResponse {
  token: string;
  expiresAt: string;
  user: { id: string; name: string; email: string; role: string };
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange =
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<LoginResponse>("/api/auth/login", form);
      const token = response?.token;
      if (!token) {
        throw new Error("Missing auth token");
      }
      login(token);
      router.push("/products");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-lg px-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Sign in to Productly</h1>
            <p className="text-sm text-slate-500">Access your products and manage inventory.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange("email")} required />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                required
              />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
