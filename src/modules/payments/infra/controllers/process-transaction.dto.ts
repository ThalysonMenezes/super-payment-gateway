import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, MaxLength } from 'class-validator';
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

  @ApiProperty({ example: 100.5, description: 'Valor em formato decimal/float' })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'visa', description: 'Bandeira ou método' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
