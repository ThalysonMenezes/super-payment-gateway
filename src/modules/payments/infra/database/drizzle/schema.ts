import { jsonb } from 'drizzle-orm/pg-core';
import { uuid, bigint, text, timestamp, uniqueIndex, pgSchema } from 'drizzle-orm/pg-core';

export const mySchema = pgSchema('my_schema');

export const transactionStatusEnum = mySchema.enum('transaction_status', [
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
]);

export const transactions = mySchema.table('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  merchantId: uuid('merchant_id').notNull(),
  amount: bigint('amount', { mode: 'bigint' }).notNull(),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  idempotency_key: text('idempotency_key').notNull(),
  providerResponse: jsonb('provider_response').$type<Record<string, any> | null>(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Índice definido separadamente (forma moderna)
export const transactionsMerchantIdempotencyIdx = uniqueIndex('transactions_merchant_id_idempotency_key_idx').on(
  transactions.merchantId,
  transactions.idempotency_key,
);
