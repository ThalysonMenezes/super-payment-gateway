export class Amount {
  private readonly value: bigint;

  private constructor(value: bigint) {
    this.value = value;
    Object.freeze(this); // Garante imutabilidade
  }

  public static create(value: number): Amount {
    // Validação de negócio: Gateway não processa valores negativos
    if (typeof value === 'number' && value < 0) {
      throw new Error('Amount cannot be negative');
    }

    return new Amount(BigInt(value));
  }

  // Retorna para o banco
  public toRaw(): bigint {
    return this.value;
  }

  // Retorna para a API
  public toString(): string {
    return this.value.toString();
  }

  get cents(): bigint {
    return this.value;
  }
}
