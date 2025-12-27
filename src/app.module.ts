import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PaymentsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
