import type { PaginatedResponse, Product } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type FetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }

  return (await res.json()) as T;
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  query?: string;
}): Promise<PaginatedResponse<Product>> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.query) search.set("query", params.query);

  const queryString = search.toString();
  const path = `/api/products${queryString ? `?${queryString}` : ""}`;
  return apiFetch<PaginatedResponse<Product>>(path, { method: "GET" });
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`, { method: "GET" });
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: payload
  });
}

export async function logout() {
  return apiFetch<{ success: boolean }>("/api/auth/logout", {
    method: "POST"
  });
}
