export abstract class AbstractLoginAttemptsRepository {
  abstract incrementAttempts(email: string): Promise<number>;
  abstract getAttempts(email: string): Promise<number>;
  abstract isBlocked(email: string): Promise<boolean>;
  abstract resetAttempts(email: string): Promise<void>;
  abstract block(email: string, ttlSeconds: number): Promise<void>;
}