import { Transaction } from '@/modules/payments/domain/entities/transaction';
export abstract class ITransactionRepository {
  abstract findByExternalId: (merchantId: string, idempotencyKey: string) => Promise<Transaction | null>;
  abstract save: (transaction: Transaction) => Promise<void>;
  abstract update: (transaction: Transaction) => Promise<void>;
}
