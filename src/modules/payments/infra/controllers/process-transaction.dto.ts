import { IsNotEmpty, IsString, IsUUID, Min, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessTransactionDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({ example: 'req_unique_12345' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  idempotencyKey: string;

  @ApiProperty({ example: 100, description: 'Amount em formato inteiro/number' })
  @IsInt({ message: 'O amount deve ser um número inteiro (centavos)' })
  @Min(1, { message: 'O amount não pode ser menor que 1' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'visa', description: 'Bandeira ou método' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
