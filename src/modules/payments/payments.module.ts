import { Module } from '@nestjs/common';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { ProcessTransactionController } from '@/modules/payments/infra/controllers/process-transaction.controller';
import { DrizzleTransactionRepository } from '@/modules/payments/infra/database/drizzle/repositories/transaction.repository';
import { ITransactionRepository } from '@/modules/payments/domain/repositories';
import { ListTransactionsQuery } from '@/modules/payments/app/queries';
import { DrizzleListTransactions } from '@/modules/payments/infra/database/drizzle/queries';

@Module({
  controllers: [ProcessTransactionController],
  providers: [
    ProcessTransactionUseCase,
    {
      provide: ITransactionRepository,
      useClass: DrizzleTransactionRepository,
    },
    {
      provide: ListTransactionsQuery,
      useClass: DrizzleListTransactions,
    },
  ],
  exports: [ProcessTransactionUseCase],
})
export class PaymentsModule {}
