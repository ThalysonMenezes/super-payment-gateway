import { Module } from '@nestjs/common';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { ProcessTransactionController } from '@/modules/payments/infra/controllers/process-transaction.controller';
import { DrizzleTransactionRepository } from '@/modules/payments/infra/database/drizzle/repositories/transaction.repository';
import { ITransactionRepository } from '@/modules/payments/domain/repositories';

@Module({
  controllers: [ProcessTransactionController],
  providers: [
    ProcessTransactionUseCase,
    {
      provide: ITransactionRepository,
      useClass: DrizzleTransactionRepository,
    },
  ],
  exports: [ProcessTransactionUseCase],
})
export class PaymentsModule {}
