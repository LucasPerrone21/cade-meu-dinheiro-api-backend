import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from 'src/config/env';

@Injectable()
export class RedisService {
  private redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  });

  async getValue(key: string) {
    const value = await this.redisClient.get(key);
    return value;
  }
  async setValue(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }
}
