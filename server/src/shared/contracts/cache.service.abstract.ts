export interface CacheOptions {
  ttl?: number; 
}

export abstract class AbstractCacheService {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set(key: string, value: any, options?: CacheOptions): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract invalidatePattern(pattern: string): Promise<void>;
}