export type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  stock: number;
  images: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
