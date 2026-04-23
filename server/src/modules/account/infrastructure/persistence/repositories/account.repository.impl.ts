import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/application/ports/base-crud.repository';
import { AbstractAccountRepository } from '../../../domain/repositories/account.repository.abstract';
import { Account } from '../../../domain/entities/account.entity';
import { AccountOrmEntity } from '../orm-entities/account.orm-entity';
import { AccountMapper } from '../mappers/account.mapper';
import { AbstractCacheService } from 'src/shared/application/ports/cache.service.abstract';

@Injectable()
export class AccountRepository
  extends BaseCrudRepository<Account, AccountOrmEntity, string>
  implements AbstractAccountRepository
{
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepo: Repository<AccountOrmEntity>,
    @Optional() cacheService: AbstractCacheService, 
  ) {
    super(accountRepo, {
      toDomain: AccountMapper.toDomain,
      toOrm: AccountMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: string): string | null {
    return `accounts:id:${id}`;
  }

  protected getCacheKeyForAll(): string | null {
    return 'accounts:all';
  }

  async findByCustomerId(customerId: string): Promise<Account[]> {
    const key = `accounts:customer:${customerId}`;
    
    return this.withCache(key, 300, async () => {
      const ormAccounts = await this.repository.find({ 
        where: { customerId } as any 
      });
      return ormAccounts.map(this.mapper.toDomain);
    });
  }

  async findByNumber(number: string): Promise<Account | null> {
    const key = `accounts:number:${number}`;
    
    return this.withCache(key, 300, async () => {
      const orm = await this.repository.findOne({ 
        where: { number } as any 
      });
      return orm ? this.mapper.toDomain(orm) : null;
    });
  }

  protected serializeEntity(domain: Account): any {
    return {
      id: domain.id,
      number: domain.number,
      balance: domain.balance, 
      customerId: domain.customerId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  protected deserializeEntity(data: any): Account {
    return this.mapper.toDomain(data);
  }

  protected async invalidateCacheById(id: string): Promise<void> {
    await super.invalidateCacheById(id);

    if (this.cacheService) {
      await this.cacheService.invalidatePattern('accounts:*');
    }
  }
}
