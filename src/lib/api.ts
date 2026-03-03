type ApiErrorPayload = {
  error?: string;
  message?: string;
};

const buildErrorMessage = (payload: ApiErrorPayload | null, statusText: string) => {
  if (!payload) return statusText || 'Request failed.';
  return payload.error || payload.message || statusText || 'Request failed.';
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const request = async <T>(url: string, init: RequestInit, token?: string): Promise<T> => {
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...init, headers });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(payload as ApiErrorPayload | null, response.statusText));
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

export const api = {
  get: async <T>(url: string, token?: string) => request<T>(url, { method: 'GET' }, token),
  post: async <T>(url: string, body: unknown, token?: string) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }, token)
};

export default api;
