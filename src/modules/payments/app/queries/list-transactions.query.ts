import { Paginated, PaginationParams } from '@/common/app/pagination';
import { TransactionProps } from '@/modules/payments/domain/entities/transaction/interfaces';

export interface ListTransactionsInput extends PaginationParams {}

export interface TransactionView extends Omit<TransactionProps, 'amount'> {
  id: string;
  amount: string;
}

export abstract class ListTransactionsQuery {
  abstract execute(input: ListTransactionsInput): Promise<Paginated<TransactionView>>;
}
