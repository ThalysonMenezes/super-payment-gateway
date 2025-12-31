import { Amount } from '@/common/domain/value-objects/amount.vo';

export type TransactionStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface TransactionProps {
  merchantId: string;
  idempotencyKey: string;
  amount: Amount;
  status: TransactionStatus;
  providerResponse?: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}
