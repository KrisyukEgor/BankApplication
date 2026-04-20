import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { AbstractAccountRepository } from '../../../domain/repositories/account.repository.abstract';
import { Account } from '../../../domain/entities/account.entity';
import { AccountOrmEntity } from '../orm-entities/account.orm-entity';
import { AccountMapper } from '../mappers/account.mapper';

@Injectable()
export class AccountRepository
  extends BaseCrudRepository<Account, AccountOrmEntity, string>
  implements AbstractAccountRepository
{
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepo: Repository<AccountOrmEntity>,
  ) {
    super(accountRepo, {
      toDomain: AccountMapper.toDomain,
      toOrm: AccountMapper.toOrm,
    });
  }

  async findByCustomerId(customerId: string): Promise<Account[]> {
    const ormAccounts = await this.repository.find({ where: { customerId } as any });
    return ormAccounts.map(this.mapper.toDomain);
  }

  async findByNumber(number: string): Promise<Account | null> {
    const orm = await this.repository.findOne({ where: { number } as any });
    return orm ? this.mapper.toDomain(orm) : null;
  }
}