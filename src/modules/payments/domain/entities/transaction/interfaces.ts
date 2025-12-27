export type TransactionStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface TransactionProps {
  merchantId: string;
  idempotencyKey: string;
  amount: bigint;
  status: TransactionStatus;
  providerResponse?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}
