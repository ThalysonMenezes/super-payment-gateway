import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { ProcessTransactionDTO } from '@/modules/payments/infra/controllers/process-transaction.dto';
import { ListTransactionsQuery } from '@/modules/payments/app/queries';

@Controller('payments')
export class ProcessTransactionController {
  constructor(
    private readonly processTransactionUseCase: ProcessTransactionUseCase,
    private readonly listTransactionsQuery: ListTransactionsQuery,
  ) {}

  @Post('process')
  async handle(@Body() dto: ProcessTransactionDTO) {
    const result = await this.processTransactionUseCase.execute({
      merchantId: dto.merchantId,
      idempotencyKey: dto.idempotencyKey,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
    });

    return { success: true, data: result.toJSON() };
  }

  @Get()
  async listTransactions(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    const result = await this.listTransactionsQuery.execute({ page: Number(page), limit: Number(limit) });
    return { succes: true, ...result };
  }
}
