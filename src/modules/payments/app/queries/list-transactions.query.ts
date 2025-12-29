import { Paginated, PaginationParams } from '@/common/app/pagination';

export interface ListTransactionsInput extends PaginationParams {}

export interface TransactionListItemDTO {
  id: string;
  merchantId: string;
  idempotencyKey: string;
  amount: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class ListTransactionsQuery {
  abstract execute(input: ListTransactionsInput): Promise<Paginated<TransactionListItemDTO>>;
}
