import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@/infra/database/postgres-drizzle/drizzle-connection.module';

@Module({
  imports: [ConfigModule.forRoot(), DrizzleModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
