import { DeepPartial } from 'typeorm';
import { Account } from '../../../domain/entities/account.entity';
import { AccountOrmEntity } from '../orm-entities/account.orm-entity';

export class AccountMapper {
  static toDomain(orm: AccountOrmEntity): Account {
    return new Account({
      id: orm.id,
      customerId: orm.customerId,
      number: orm.number,
      balance: Number(orm.balance),
      typeId: orm.typeId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Account): DeepPartial<AccountOrmEntity> {
    const orm = new AccountOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.customerId = domain.customerId;
    orm.number = domain.number;
    orm.balance = domain.balance;
    orm.typeId = domain.typeId;
    return orm;
  }
}