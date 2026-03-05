export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  per_page: number;
  total: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  user: AuthUser | null;
  token?: string;
}
