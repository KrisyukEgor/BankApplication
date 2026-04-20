import { DeepPartial } from 'typeorm';
import { TransactionStatus } from '../../../domain/entities/transaction-status.entity';
import { TransactionStatusOrmEntity } from '../orm-entities/transaction-status.orm-entity';

export class TransactionStatusMapper {
  static toDomain(orm: TransactionStatusOrmEntity): TransactionStatus {
    return new TransactionStatus({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: TransactionStatus): DeepPartial<TransactionStatusOrmEntity> {
    const orm = new TransactionStatusOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.code = domain.code;
    orm.name = domain.name;
    return orm;
  }
}