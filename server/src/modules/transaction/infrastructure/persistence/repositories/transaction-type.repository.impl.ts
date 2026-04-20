import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { AbstractTransactionTypeRepository } from '../../../domain/repositories/transaction-type.repository.abstract';
import { TransactionType } from '../../../domain/entities/transaction-type.entity';
import { TransactionTypeOrmEntity } from '../orm-entities/transaction-type.orm-entity';
import { TransactionTypeMapper } from '../mappers/transaction-type.mapper';
import { CacheTTL } from 'src/shared/contracts/cache-ttl';
import { AbstractCacheService } from 'src/shared/contracts/cache.service.abstract';

@Injectable()
export class TransactionTypeRepository
  extends BaseCrudRepository<TransactionType, TransactionTypeOrmEntity, string>
  implements AbstractTransactionTypeRepository
{
  constructor(
    @InjectRepository(TransactionTypeOrmEntity) repository: Repository<TransactionTypeOrmEntity>,
    cacheService: AbstractCacheService,
  ) {
    super(repository, {
      toDomain: TransactionTypeMapper.toDomain,
      toOrm: TransactionTypeMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: string): string | null {
    return `transaction_types:id:${id}`;
  }

  protected getCacheKeyForAll(): string | null {
    return 'transaction_types:all';
  }

  protected getTTLForId(): number {
    return CacheTTL.REFERENCE_DATA;
  }

  protected getTTLForAll(): number {
    return CacheTTL.REFERENCE_DATA;
  }

  async findByCode(code: string): Promise<TransactionType | null> {
    const cacheKey = `transaction_types:code:${code}`;
    return this.withCache(cacheKey, CacheTTL.REFERENCE_DATA, async () => {
      const orm = await this.repository.findOne({ where: { code } as any });
      return orm ? this.mapper.toDomain(orm) : null;
    });
  }
}