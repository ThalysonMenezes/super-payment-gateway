export interface TransactionListItemDTO {
  id: string;
  merchantId: string;
  idempotencyKey: string;
  amount: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListTransactionsInput {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  lastPage: number;
  data: T[];
}

export abstract class ListTransactionsQuery {
  abstract execute(input: ListTransactionsInput): Promise<PaginatedResult<TransactionListItemDTO>>;
}
