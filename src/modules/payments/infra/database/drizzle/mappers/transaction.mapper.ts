import { Transaction } from '@/modules/payments/domain/entities/transaction';

export class TransactionMapper {
  static toDomain(raw: any): Transaction {
    return new Transaction(
      {
        merchantId: raw.merchantId,
        amount: BigInt(raw.amount),
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
      amount: data.amount,
      status: data.status,
      idempotency_key: data.idempotencyKey,
      provider_response: data.providerResponse,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }
}
