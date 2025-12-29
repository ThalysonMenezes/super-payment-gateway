import { Paginated } from '@/common/app/pagination';

export function createPaginationResponse<T>(total: number, page: number, limit: number, data: T[]): Paginated<T> {
  return {
    total,
    page,
    lastPage: Math.ceil(total / limit),
    limit,
    data,
  };
}
