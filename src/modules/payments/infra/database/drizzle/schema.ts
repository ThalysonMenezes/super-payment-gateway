import { pgTable, pgEnum, uuid, bigint, text, timestamp, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

export const transactionStatusEnum = pgEnum('transaction_status', [
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
]);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    merchantId: uuid('merchant_id').notNull(),
    amount: bigint('amount', { mode: 'bigint' }).notNull(),
    status: transactionStatusEnum('status').default('PENDING').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    providerResponse: jsonb('provider_response').$type<Record<string, any> | null>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    merchantIdempotencyUnique: uniqueIndex('transactions_merchant_id_idempotency_key_idx').on(
      table.merchantId,
      table.idempotencyKey,
    ),
  }),
);
