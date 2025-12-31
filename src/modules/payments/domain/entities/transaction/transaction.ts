import { randomUUID } from 'node:crypto';
import { TransactionProps, TransactionStatus } from './interfaces';

export class Transaction {
  private readonly _id: string; // Identidade
  private readonly _props: TransactionProps; // Estado

  private constructor(props: TransactionProps, id?: string) {
    this._id = id ?? randomUUID(); // Reidratação
    this._props = props;
  }

  public static create(props: TransactionProps, id?: string): Transaction {
    // Aqui pode ser adicionada validações específicas da Entidade

    const date = new Date();
    return new Transaction(
      {
        ...props,
        status: props.status ?? 'PENDING',
        providerResponse: props.providerResponse ?? null,
        createdAt: props.createdAt ?? date,
        updatedAt: props.updatedAt ?? date,
      },
      id,
    );
  }

  public authorize(response: Record<string, any>): void {
    if (this._props.status !== 'PENDING') {
      throw new Error(`Transação não pode ser autorizada a partir do status ${this._props.status}`);
    }
    this._props.status = 'AUTHORIZED';
    this._props.providerResponse = response;
    this._props.updatedAt = new Date();
  }

  public capture(): void {
    if (this._props.status !== 'AUTHORIZED') {
      throw new Error('Apenas transações autorizadas podem ser capturadas.');
    }
    this._props.status = 'CAPTURED';
    this._props.updatedAt = new Date();
  }

  public fail(response: Record<string, any>): void {
    if (['CAPTURED', 'REFUNDED'].includes(this._props.status)) {
      throw new Error('Não é possível marcar como falha uma transação já liquidada.');
    }
    this._props.status = 'FAILED';
    this._props.providerResponse = response;
    this._props.updatedAt = new Date();
  }

  public refund(): void {
    if (this._props.status !== 'CAPTURED') {
      throw new Error('Apenas transações capturadas podem ser estornadas.');
    }
    this._props.status = 'REFUNDED';
    this._props.updatedAt = new Date();
  }

  // Mapper para converter a Entidade para o Banco.
  public toJSON() {
    return {
      id: this._id,
      ...this._props,
      amount: this._props.amount.toString(),
    };
  }
}
