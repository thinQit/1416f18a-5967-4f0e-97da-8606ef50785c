export type Product = {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  totalPages: number;
  totalCount: number;
};
