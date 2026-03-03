export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  const json = text ? (JSON.parse(text) as ApiResponse<T>) : undefined;

  if (!response.ok) {
    return (
      json ?? {
        success: false,
        error: response.statusText || 'Request failed'
      }
    );
  }

  return (
    json ?? {
      success: true
    }
  );
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(url: string, body?: unknown, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T>(url: string, body?: unknown, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...init,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...init,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
  return handleResponse<T>(response);
}

export const api = {
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  delete: apiDelete
};
