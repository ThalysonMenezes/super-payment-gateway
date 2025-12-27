import { Module } from '@nestjs/common';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { ProcessTransactionController } from '@/modules/payments/infra/controllers/process-transaction.controller';

@Module({
  controllers: [ProcessTransactionController],
  providers: [ProcessTransactionUseCase],
  exports: [ProcessTransactionUseCase],
})
export class PaymentsModule {}
