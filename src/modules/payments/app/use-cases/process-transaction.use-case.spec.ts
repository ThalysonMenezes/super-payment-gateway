import { Amount } from '@/common/domain/value-objects/amount.vo';
import { ProcessTransactionUseCase } from '@/modules/payments/app/use-cases/process-transaction.use-case';
import { Transaction } from '@/modules/payments/domain/entities/transaction';
import { ITransactionRepository } from '@/modules/payments/domain/repositories';
import { ConflictException } from '@nestjs/common';

describe('ProcessTransactionUseCase', () => {
  let sut: ProcessTransactionUseCase;
  let repository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    repository = {
      findByExternalId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    sut = new ProcessTransactionUseCase(repository);
  });

  it('deve retornar erro de conflito se a chave de idempotência existir com valor diferente', async () => {
    const input = { merchantId: 'm1', idempotencyKey: 'k1', amount: 1000, paymentMethod: 'credit_card' };

    const existing = Transaction.create({ ...input, amount: Amount.create(5000), status: 'PENDING' });
    jest.spyOn(repository, 'findByExternalId').mockResolvedValue(existing);

    await expect(sut.execute(input)).rejects.toThrow(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('deve processar uma nova transação com sucesso', async () => {
    const input = { merchantId: 'm1', idempotencyKey: 'new_key', amount: 2000, paymentMethod: 'credit_card' };
    jest.spyOn(repository, 'findByExternalId').mockResolvedValue(null);

    const result = await sut.execute(input);

    expect(result).toBeInstanceOf(Transaction);
    expect(result.toJSON().idempotencyKey).toBe('new_key');
    expect(result.toJSON().amount).toBe('2000');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
