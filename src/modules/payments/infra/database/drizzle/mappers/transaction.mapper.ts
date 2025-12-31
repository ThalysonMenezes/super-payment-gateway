import { Transaction } from '@/modules/payments/domain/entities/transaction';

export class TransactionMapper {
  static toDomain(raw: any): Transaction {
    return Transaction.create(
      {
        merchantId: raw.merchantId,
        amount: raw.amount,
        status: raw.status,
        idempotencyKey: raw.idempotencyKey,
        providerResponse: raw.providerResponse,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPersistence(domain: Transaction) {
    const data = domain.toJSON();
    return {
      id: data.id,
      merchantId: data.merchantId,
      amount: BigInt(data.amount),
      status: data.status,
      idempotencyKey: data.idempotencyKey,
      providerResponse: data.providerResponse ?? null,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }
}
