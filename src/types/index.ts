export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  quantity: number;
  images: string[];
  created_by_user_id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  user: User | null;
  token?: string | null;
};
