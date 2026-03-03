export type ApiError = {
  message: string;
  status: number;
};

export type ApiResult<T> = {
  data?: T;
  error?: string;
  status: number;
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw { message: message || response.statusText, status: response.status } as ApiError;
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const status = response.status;
  const text = await response.text();
  let parsed: unknown = null;

  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const error =
      (parsed as { error?: string; message?: string } | null)?.error ||
      (parsed as { error?: string; message?: string } | null)?.message ||
      text ||
      response.statusText;

    return { error, status };
  }

  if (status === 204) {
    return { status };
  }

  const data =
    parsed && typeof parsed === 'object' && parsed !== null && 'data' in parsed
      ? (parsed as { data: T }).data
      : (parsed as T);

  return { data, status };
}

export async function getJSON<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: 'GET' });
}

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export const api = {
  get<T>(url: string, options: RequestInit = {}) {
    return request<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: unknown, options: RequestInit = {}) {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  put<T>(url: string, body?: unknown, options: RequestInit = {}) {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(url: string, options: RequestInit = {}) {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};
