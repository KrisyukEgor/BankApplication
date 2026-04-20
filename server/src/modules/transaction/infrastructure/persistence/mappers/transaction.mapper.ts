import { DeepPartial } from 'typeorm';
import { TransactionDomain } from '../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../orm-entities/transaction.orm-entity';

export class TransactionMapper {
  static toDomain(orm: TransactionOrmEntity): TransactionDomain {
    return new TransactionDomain({
      id: orm.id,
      publicId: orm.publicId,
      fromAccountId: orm.fromAccountId,
      toAccountId: orm.toAccountId,
      amount: Number(orm.amount),
      typeId: orm.typeId,
      statusId: orm.statusId,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: TransactionDomain): DeepPartial<TransactionOrmEntity> {
    const orm = new TransactionOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.publicId = domain.publicId;
    orm.fromAccountId = domain.fromAccountId;
    orm.toAccountId = domain.toAccountId;
    orm.amount = domain.amount;
    orm.typeId = domain.typeId;
    orm.statusId = domain.statusId;
    orm.description = domain.description;
    return orm;
  }
}