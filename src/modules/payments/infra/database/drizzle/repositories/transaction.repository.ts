import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '@/modules/payments/domain/entities/transaction';
import { TransactionMapper } from '@/modules/payments/infra/database/drizzle/mappers';
import { ITransactionRepository } from '@/modules/payments/domain/repositories';

import * as schema from '@/modules/payments/infra/database/drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE_DB } from '@/infra/database/postgres-drizzle/drizzle-connection.module';
import { DrizzleErrorHandling } from '@/infra/database/postgres-drizzle/drizzle-error.exception';

@Injectable()
export class DrizzleTransactionRepository implements ITransactionRepository {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByExternalId(merchantId: string, idempotencyKey: string): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(schema.transactions)
      .where(
        and(eq(schema.transactions.merchantId, merchantId), eq(schema.transactions.idempotencyKey, idempotencyKey)),
      )
      .limit(1)
      .catch(
        DrizzleErrorHandling.context({
          table: 'transactions',
          method: 'findByExternalId',
          operation: 'select',
        }),
      );

    if (result?.length === 0) return null;
    return TransactionMapper.toDomain(result[0]);
  }

  async save(transaction: Transaction): Promise<void> {
    const raw = TransactionMapper.toPersistence(transaction);
    await this.db
      .insert(schema.transactions)
      .values(raw)
      .catch(
        DrizzleErrorHandling.context({
          table: 'transactions',
          method: 'save',
          operation: 'insert',
        }),
      );
  }

  async update(transaction: Transaction): Promise<void> {
    const raw = TransactionMapper.toPersistence(transaction);
    await this.db
      .update(schema.transactions)
      .set(raw)
      .where(eq(schema.transactions.id, raw.id))
      .catch(
        DrizzleErrorHandling.context({
          table: 'transactions',
          method: 'update',
          operation: 'update',
        }),
      );
  }
}
