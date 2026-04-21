import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AbstractCacheService, CacheOptions } from '../application/ports/cache.service.abstract';

@Injectable()
export class RedisCacheService implements AbstractCacheService {

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}
  
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    } 

    return JSON.parse(data) as T;
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const serialized = JSON.stringify(value);
    
    if (options?.ttl) {
      await this.redis.setex(key, options.ttl, serialized);
    } 
    else {
      await this.redis.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const stream = this.redis.scanStream({match: pattern, count: 100});

    for await (const keys of stream) {
      if(keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }
}