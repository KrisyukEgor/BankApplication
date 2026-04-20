import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { AbstractTransactionRepository } from '../../../domain/repositories/transaction.repository.abstract';
import { TransactionDomain } from '../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../orm-entities/transaction.orm-entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRepository
  extends BaseCrudRepository<TransactionDomain, TransactionOrmEntity, string>
  implements AbstractTransactionRepository
{
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly txRepo: Repository<TransactionOrmEntity>,
  ) {
    super(txRepo, {
      toDomain: TransactionMapper.toDomain,
      toOrm: TransactionMapper.toOrm,
    });
  }

  async findByPublicId(publicId: string): Promise<TransactionDomain | null> {
    const orm = await this.repository.findOne({ where: { publicId } as any });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByAccountId(accountId: string, limit?: number, offset?: number): Promise<TransactionDomain[]> {
    const query = this.repository.createQueryBuilder('tx')
      .where('tx.from_account_id = :accountId OR tx.to_account_id = :accountId', { accountId })
      .orderBy('tx.created_at', 'DESC');
    if (limit) query.limit(limit);
    if (offset) query.offset(offset);
    const orms = await query.getMany();
    return orms.map(this.mapper.toDomain);
  }

  async findByCustomerId(customerId: string, limit?: number, offset?: number): Promise<TransactionDomain[]> {
    const query = this.repository.createQueryBuilder('tx')
      .innerJoin('accounts', 'a', 'a.id = tx.from_account_id OR a.id = tx.to_account_id')
      .where('a.customer_id = :customerId', { customerId })
      .orderBy('tx.created_at', 'DESC');
    if (limit) query.limit(limit);
    if (offset) query.offset(offset);
    const orms = await query.getMany();
    return orms.map(this.mapper.toDomain);
  }
}