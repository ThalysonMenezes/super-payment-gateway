import { Module } from '@nestjs/common';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@/infra/database/postgres-drizzle/drizzle-connection.module';

@Module({
  imports: [ConfigModule.forRoot(), DrizzleModule, PaymentsModule],
})
export class AppModule {}
