export interface ApiOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(method: string, url: string, body?: unknown, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options.signal
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, options?: ApiOptions) => request<T>('GET', url, undefined, options),
  post: <T>(url: string, body?: unknown, options?: ApiOptions) => request<T>('POST', url, body, options),
  put: <T>(url: string, body?: unknown, options?: ApiOptions) => request<T>('PUT', url, body, options),
  delete: <T>(url: string, options?: ApiOptions) => request<T>('DELETE', url, undefined, options)
};
