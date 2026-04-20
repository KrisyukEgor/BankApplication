import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { AbstractTransactionStatusRepository } from '../../../domain/repositories/transaction-status.repository.abstract';
import { TransactionStatus } from '../../../domain/entities/transaction-status.entity';
import { TransactionStatusOrmEntity } from '../orm-entities/transaction-status.orm-entity';
import { TransactionStatusMapper } from '../mappers/transaction-status.mapper';
import { CacheTTL } from 'src/shared/contracts/cache-ttl';

@Injectable()
export class TransactionStatusRepository
  extends BaseCrudRepository<TransactionStatus, TransactionStatusOrmEntity, string>
  implements AbstractTransactionStatusRepository
{
  constructor(
    @InjectRepository(TransactionStatusOrmEntity)
    private readonly statusRepo: Repository<TransactionStatusOrmEntity>,
  ) {
    super(statusRepo, {
      toDomain: TransactionStatusMapper.toDomain,
      toOrm: TransactionStatusMapper.toOrm,
    });
  }

  protected getCacheKeyForId(id: string): string | null {
    return `transaction_statuses:id:${id}`;
  }

  protected getCacheKeyForAll(): string | null {
    return 'transaction_statuses:all';
  }

  protected getTTLForId(): number {
    return CacheTTL.REFERENCE_DATA;
  }

  protected getTTLForAll(): number {
    return CacheTTL.REFERENCE_DATA;
  }

  async findByCode(code: string): Promise<TransactionStatus | null> {
    const cacheKey = `transaction_statuses:code:${code}`;
    return this.withCache(cacheKey, CacheTTL.REFERENCE_DATA, async () => {
      const orm = await this.repository.findOne({ where: { code } as any });
      return orm ? this.mapper.toDomain(orm) : null;
    });
  }

}