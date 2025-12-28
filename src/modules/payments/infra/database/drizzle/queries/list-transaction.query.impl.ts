import { Inject } from '@nestjs/common';
import { Transaction } from '@/modules/payments/domain/entities/transaction';
import { ListTransactionsQuery } from '@/modules/payments/app/queries';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_DB } from '@/infra/database/postgres-drizzle/drizzle-connection.module';
import * as schema from '@/modules/payments/infra/database/drizzle/schema';
import { ListTransactionsInput } from '@/modules/payments/app/queries/list-transactions.query';
import { sql } from 'drizzle-orm';

export class DrizzleListTransactions implements ListTransactionsQuery {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async execute(input: ListTransactionsInput) {
    const { page, limit } = input;
    const offset = (page - 1) * limit;

    const [totalResult, rows] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)` }).from(schema.transactions),
      this.db
        .select({
          id: schema.transactions.id,
          merchantId: schema.transactions.merchantId,
          idempotencyKey: schema.transactions.idempotencyKey,
          status: schema.transactions.status,
          amount: schema.transactions.amount,
          createdAt: schema.transactions.createdAt,
          updatedAt: schema.transactions.updated_at,
        })
        .from(schema.transactions)
        .limit(limit)
        .offset(offset),
    ]);

    const total = Number(totalResult[0].count);

    return {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      data: rows.map((row) => ({
        id: row.id,
        merchantId: row.merchantId,
        idempotencyKey: row.idempotencyKey,
        amount: row.amount.toString(),
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
    };
  }
}
