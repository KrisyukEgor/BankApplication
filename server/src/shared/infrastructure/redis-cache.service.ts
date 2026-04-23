import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { AbstractCacheService, CacheOptions } from '../application/ports/cache.service.abstract';

@Injectable()
export class RedisCacheService implements AbstractCacheService, OnModuleDestroy {

  private publisher: Redis;
  private subscriber: Redis;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {
    
    const redisOptions = this.redis.options;

    this.publisher = new Redis(redisOptions);
    this.subscriber = new Redis(redisOptions);
  }
  
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

  async publish(channel: string, message: any): Promise<void> {
    const payload = JSON.stringify(message);
    await this.publisher.publish(channel, payload);
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        callback(JSON.parse(message));
      }
    });
  }

  async onModuleDestroy() {
    try {
      await Promise.all([
        this.publisher.quit(),
        this.subscriber.quit()
      ]);
      console.log('Redis Pub/Sub connections closed');
    } catch (error) {
      console.error('Error closing Redis connections:', error);
    }
  }
}