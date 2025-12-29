export interface PaginationParams {
  page: number;
  limit: number;
}

export interface Paginated<T> {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  data: T[];
}
