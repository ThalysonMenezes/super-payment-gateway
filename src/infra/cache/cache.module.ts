import { ICache } from '@/common/app/cache.interface';
import { RedisCache } from '@/infra/cache/redis/redis.cache';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [{ provide: ICache, useClass: RedisCache }],
  exports: [ICache],
})
export class CacheModule {}
