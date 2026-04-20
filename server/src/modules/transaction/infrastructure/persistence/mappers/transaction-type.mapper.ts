import { DeepPartial } from 'typeorm';
import { TransactionType } from '../../../domain/entities/transaction-type.entity';
import { TransactionTypeOrmEntity } from '../orm-entities/transaction-type.orm-entity';

export class TransactionTypeMapper {
  static toDomain(orm: TransactionTypeOrmEntity): TransactionType {
    return new TransactionType({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: TransactionType): DeepPartial<TransactionTypeOrmEntity> {
    const orm = new TransactionTypeOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.code = domain.code;
    orm.name = domain.name;
    orm.description = domain.description;
    return orm;
  }
}