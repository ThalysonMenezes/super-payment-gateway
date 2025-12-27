import { Transaction } from '@/modules/payments/domain/entities/transaction';

export interface ITransactionRepository {
  findByExternalId(merchantId: string, idempotencyKey: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
}
