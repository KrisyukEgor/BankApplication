import { DeepPartial } from 'typeorm';
import { AccountType } from '../../../domain/entities/account-type.entity';
import { AccountTypeOrmEntity } from '../orm-entities/account-type.orm-entity';

export class AccountTypeMapper {
  static toDomain(orm: AccountTypeOrmEntity): AccountType {
    return new AccountType({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: AccountType): DeepPartial<AccountTypeOrmEntity> {
    const orm = new AccountTypeOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.code = domain.code;
    orm.name = domain.name;
    orm.description = domain.description;
    return orm;
  }
}