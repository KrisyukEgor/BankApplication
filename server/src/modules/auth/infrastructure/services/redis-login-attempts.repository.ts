import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AbstractLoginAttemptsRepository } from '../../application/ports/login-attempts.repository.abstract';

@Injectable()
export class RedisLoginAttemptsRepository implements AbstractLoginAttemptsRepository {
  private readonly maxAttempts = 3;
  private readonly blockTTL: number; 

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private getAttemptsKey(email: string): string {
    return `login_attempts:${email}`;
  }

  private getBlockKey(email: string): string {
    return `login_blocked:${email}`;
  }

  async incrementAttempts(email: string): Promise<number> {
    const key = this.getAttemptsKey(email);

    const attempts = await this.redis.incr(key);
    
    await this.redis.expire(key, this.blockTTL + 300);
    return attempts;
  }

  async getAttempts(email: string): Promise<number> {
    const key = this.getAttemptsKey(email);
    const val = await this.redis.get(key);
    return val ? parseInt(val, 10) : 0;
  }

  async isBlocked(email: string): Promise<boolean> {
    const key = this.getBlockKey(email);
    const blocked = await this.redis.get(key);
    return blocked !== null;
  }

  async resetAttempts(email: string): Promise<void> {
    const key = this.getAttemptsKey(email);
    await this.redis.del(key);
  }

  async block(email: string, ttlSeconds: number): Promise<void> {
    const blockKey = this.getBlockKey(email);
    await this.redis.setex(blockKey, ttlSeconds, '1');
    await this.resetAttempts(email);
  }
}