import { Controller, Post, Body } from '@nestjs/common';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { ProcessTransactionDTO } from '@/modules/payments/infra/controllers/process-transaction.dto';

@Controller('payments')
export class ProcessTransactionController {
  constructor(private readonly processTransactionUseCase: ProcessTransactionUseCase) {}

  @Post('process')
  async handle(@Body() dto: ProcessTransactionDTO) {
    const result = await this.processTransactionUseCase.execute({
      merchantId: dto.merchantId,
      idempotencyKey: dto.idempotencyKey,
      amount: BigInt(Math.round(dto.amount * 100)), // Convertendo decimal para centavos (bigint)
      paymentMethod: dto.paymentMethod,
    });

    return { success: true, data: result.toJSON() };
  }
}
