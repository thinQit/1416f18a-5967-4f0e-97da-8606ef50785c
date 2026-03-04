export type ApiError = {
  message: string;
  status?: number;
};

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    const err: ApiError = { message: message || res.statusText, status: res.status };
    throw err;
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { method: 'GET', ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  return parseResponse<T>(res);
}

export async function apiPost<T, B = unknown>(url: string, body?: B, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  return parseResponse<T>(res);
}

export async function apiPut<T, B = unknown>(url: string, body?: B, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  return parseResponse<T>(res);
}

export async function apiDelete<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { method: 'DELETE', ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  return parseResponse<T>(res);
}

export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
