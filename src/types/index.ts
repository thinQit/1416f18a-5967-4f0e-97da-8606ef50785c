export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  token: string;
  expires_at: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
