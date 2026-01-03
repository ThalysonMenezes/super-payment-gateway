import { Inject } from '@nestjs/common';
import { ListTransactionsQuery } from '@/modules/payments/app/queries';
import { ListTransactionsInput } from '@/modules/payments/app/queries/list-transactions.query';
import { createPaginationResponse, withPagination } from '@/common/infra/database/drizzle-pagination';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_DB } from '@/infra/database/postgres-drizzle/drizzle-connection.module';
import * as schema from '@/modules/payments/infra/database/drizzle/schema';
import { sql } from 'drizzle-orm';
import { DrizzleErrorHandling } from '@/infra/database/postgres-drizzle/drizzle-error.exception';

export class DrizzleListTransactions implements ListTransactionsQuery {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async execute(input: ListTransactionsInput) {
    const { limit, offset, page } = withPagination(input.page, input.limit);

    const errorHandler = DrizzleErrorHandling.context({
      table: 'transactions',
      method: 'query list',
      operation: 'select',
    });

    const [totalResult, rows] = await Promise.all([
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(schema.transactions)
        .catch(errorHandler),
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
        .offset(offset)
        .catch(errorHandler),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const data = rows.map((row) => ({
      id: row.id,
      merchantId: row.merchantId,
      idempotencyKey: row.idempotencyKey,
      amount: row.amount.toString(),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return createPaginationResponse(total, page, limit, data);
  }
}
