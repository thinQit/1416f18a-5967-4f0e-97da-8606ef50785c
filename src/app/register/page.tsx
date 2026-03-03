'use client';

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange =
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/register", form);
      router.push("/login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
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
            <h1 className="text-2xl font-bold text-slate-900">Create your Productly account</h1>
            <p className="text-sm text-slate-500">Register to manage products, inventory, and images.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input label="Name" name="name" value={form.name} onChange={handleChange("name")} required />
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
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
