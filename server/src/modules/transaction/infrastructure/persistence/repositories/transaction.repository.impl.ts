import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/application/ports/base-crud.repository';
import { AbstractTransactionRepository } from '../../../domain/repositories/transaction.repository.abstract';
import { TransactionDomain } from '../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../orm-entities/transaction.orm-entity';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { AbstractCacheService } from 'src/shared/application/ports/cache.service.abstract';

@Injectable()
export class TransactionRepository
  extends BaseCrudRepository<TransactionDomain, TransactionOrmEntity, string>
  implements AbstractTransactionRepository
{
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly txRepo: Repository<TransactionOrmEntity>,
    cacheService: AbstractCacheService,
  ) {
    super(txRepo, {
      toDomain: TransactionMapper.toDomain,
      toOrm: TransactionMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: string): string {
    return `transactions:id:${id}`;
  }

  async findByPublicId(publicId: string): Promise<TransactionDomain | null> {
    const key = `transactions:publicId:${publicId}`;
    return this.withCache(key, 600, async () => {
      const orm = await this.repository.findOne({ where: { publicId } as any });
      return orm ? this.mapper.toDomain(orm) : null;
    });
  }

  async findByAccountId(accountId: string, limit?: number, offset?: number): Promise<TransactionDomain[]> {
    const key = `transactions:account:${accountId}:l:${limit || 0}:o:${offset || 0}`;
    
    return this.withCache(key, 300, async () => {
      const query = this.repository.createQueryBuilder('tx')
        .where('tx.from_account_id = :accountId OR tx.to_account_id = :accountId', { accountId })
        .orderBy('tx.created_at', 'DESC');
      
      if (limit) query.limit(limit);
      if (offset) query.offset(offset);
      
      const orms = await query.getMany();
      return orms.map(this.mapper.toDomain);
    });
  }

  async findByCustomerId(customerId: string, limit?: number, offset?: number): Promise<TransactionDomain[]> {
      const key = `transactions:customer:${customerId}:l:${limit || 0}:o:${offset || 0}`;
      
      return this.withCache(key, 300, async () => {
        const query = this.repository.createQueryBuilder('tx')
          .innerJoin('accounts', 'a', 'a.id = tx.from_account_id OR a.id = tx.to_account_id')
          .where('a.customer_id = :customerId', { customerId })
          .orderBy('tx.created_at', 'DESC');
        
        if (limit) query.limit(limit);
        if (offset) query.offset(offset);
        
        const orms = await query.getMany();
        return orms.map(this.mapper.toDomain);
      });
    }

    async findByAccountIds(accountIds: string[]): Promise<TransactionDomain[]> {
      if (!accountIds.length) return [];
      
      const sortedIds = [...accountIds].sort().join(',');
      const key = `transactions:accounts_bulk:${sortedIds}`;

      return this.withCache(key, 300, async () => {
        const orms = await this.repository
          .createQueryBuilder('tx')
          .where('tx.from_account_id IN (:...accountIds) OR tx.to_account_id IN (:...accountIds)', { accountIds })
          .getMany();
        return orms.map(this.mapper.toDomain);
      });
    }

    protected async invalidateCacheById(id: string): Promise<void> {
      await super.invalidateCacheById(id);
      if (this.cacheService) {
        await this.cacheService.invalidatePattern('transactions:*');
      }
    }
}