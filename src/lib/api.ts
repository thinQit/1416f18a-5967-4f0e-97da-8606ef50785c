import type { ApiResponse, PaginatedResponse } from "@/types";

export type ApiClientOptions = {
  baseUrl?: string;
};

export class ApiClient {
  private baseUrl: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : null;

    if (data && typeof data.success === "boolean") {
      return data as ApiResponse<T>;
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.error ?? response.statusText,
      } as ApiResponse<T>;
    }

    return {
      success: true,
      data: data as T,
    } as ApiResponse<T>;
  }

  get<T>(path: string, token?: string) {
    return this.request<T>(path, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  post<T>(path: string, body?: unknown, token?: string) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  put<T>(path: string, body?: unknown, token?: string) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  delete<T>(path: string, token?: string) {
    return this.request<T>(path, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;

export type { PaginatedResponse };
