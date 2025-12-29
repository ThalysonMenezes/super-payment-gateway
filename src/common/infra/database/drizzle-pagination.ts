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

export const withPagination = (page: number, limit: number) => {
  // Possibilidade de alterar o limit para segurança
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};
