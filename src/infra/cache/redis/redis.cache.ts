import { Injectable } from '@nestjs/common';
import { ICache } from '@/common/app/cache.interface';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCache implements ICache {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: configService.get('REDIS_HOST'),
      port: Number(configService.get('REDIS_PORT')),
      // Configurações de Retry para resiliência enterprise
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  async set(key: string, value: any, ttlInSeconds: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
