export type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function apiGet<T>(url: string, options?: ApiOptions) {
  return request<T>(url, { ...options, method: "GET" });
}

export function apiPost<T>(url: string, body?: unknown, options?: ApiOptions) {
  return request<T>(url, { ...options, method: "POST", body });
}

export function apiPut<T>(url: string, body?: unknown, options?: ApiOptions) {
  return request<T>(url, { ...options, method: "PUT", body });
}

export function apiDelete<T>(url: string, options?: ApiOptions) {
  return request<T>(url, { ...options, method: "DELETE" });
}

export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete
};
