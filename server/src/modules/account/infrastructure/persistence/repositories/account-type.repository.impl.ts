import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { AbstractAccountTypeRepository } from '../../../domain/repositories/account-type.repository.abstract';
import { AccountType } from '../../../domain/entities/account-type.entity';
import { AccountTypeOrmEntity } from '../orm-entities/account-type.orm-entity';
import { AccountTypeMapper } from '../mappers/account-type.mapper';

@Injectable()
export class AccountTypeRepository
  extends BaseCrudRepository<AccountType, AccountTypeOrmEntity, string>
  implements AbstractAccountTypeRepository
{
  constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly typeRepo: Repository<AccountTypeOrmEntity>,
  ) {
    super(typeRepo, {
      toDomain: AccountTypeMapper.toDomain,
      toOrm: AccountTypeMapper.toOrm,
    });
  }

  async findByCode(code: string): Promise<AccountType | null> {
    const orm = await this.repository.findOne({ where: { code } as any });
    return orm ? this.mapper.toDomain(orm) : null;
  }
}