export const api = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Request failed");
    }

    return response.json() as Promise<T>;
  },
  async post<T>(url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Request failed");
    }

    return response.json() as Promise<T>;
  }
};
