import { ConflictException, Injectable } from '@nestjs/common';
import { Transaction } from '@/modules/payments/domain/entities/transaction';
import type { ITransactionRepository } from '@/modules/payments/domain/repositories';

interface ProcessTransactionInput {
  merchantId: string;
  idempotencyKey: string;
  amount: bigint;
  paymentMethod: string;
}

@Injectable()
export class ProcessTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(input: ProcessTransactionInput): Promise<Transaction> {
    // 1. Verificação de Idempotência
    const existingTransaction = await this.transactionRepository.findByExternalId(
      input.merchantId,
      input.idempotencyKey,
    );

    if (existingTransaction) {
      // Se já existe, retornamos a transação atual em vez de criar uma nova
      // Em fintechs, se o valor for diferente para a mesma chave, geramos erro.
      if (existingTransaction.toJSON().amount !== input.amount) {
        throw new ConflictException('Idempotency key used with different transaction amount');
      }
      return existingTransaction;
    }

    const transaction = new Transaction({
      merchantId: input.merchantId,
      idempotencyKey: input.idempotencyKey,
      amount: input.amount,
      status: 'PENDING',
    });

    // 2. Persistência Inicial
    await this.transactionRepository.save(transaction);

    // 3 Integração Externa (Simulado por enquanto)
    // TODO: Chamar Provider de Pagamento (Stripe/Cielo)

    return transaction;
  }
}
