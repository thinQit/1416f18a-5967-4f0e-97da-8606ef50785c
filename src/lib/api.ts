export type ApiResponse<T> = {
  data: T | null;
  error?: string;
  status?: number;
};

let authToken: string | null = null;

const readStoredToken = () => {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = window.localStorage.getItem("authToken");
  }
  return authToken;
};

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("authToken", token);
    } else {
      window.localStorage.removeItem("authToken");
    }
  }
};

const buildHeaders = (custom?: HeadersInit, includeJson?: boolean) => {
  const headers = new Headers(custom);
  const token = readStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (includeJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
};

async function request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") ?? "";
  let data: T | null = null;

  if (contentType.includes("application/json")) {
    data = (await res.json()) as T;
  } else {
    const text = await res.text();
    data = (text as unknown) as T;
  }

  if (!res.ok) {
    const error = typeof data === "string" ? data : (data as any)?.error ?? res.statusText;
    return { data, error, status: res.status };
  }

  return { data, status: res.status };
}

export async function apiGet<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...options,
    method: "GET",
    headers: buildHeaders(options.headers, false),
  });
}

export async function apiPost<T, B>(url: string, body: B, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  return request<T>(url, {
    ...options,
    method: "POST",
    headers: buildHeaders(options.headers, !isFormData),
    body: isFormData ? (body as FormData) : JSON.stringify(body),
  });
}

export async function apiPut<T, B>(url: string, body: B, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  return request<T>(url, {
    ...options,
    method: "PUT",
    headers: buildHeaders(options.headers, !isFormData),
    body: isFormData ? (body as FormData) : JSON.stringify(body),
  });
}

export async function apiDelete<T, B = undefined>(
  url: string,
  body?: B,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const hasBody = typeof body !== "undefined";
  const isFormData = hasBody && typeof FormData !== "undefined" && body instanceof FormData;
  return request<T>(url, {
    ...options,
    method: "DELETE",
    headers: buildHeaders(options.headers, hasBody && !isFormData),
    body: hasBody ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
  });
}

export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  setToken: setAuthToken,
  clearToken: () => setAuthToken(null),
  getToken: readStoredToken,
};
