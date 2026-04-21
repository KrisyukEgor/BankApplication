import { AbstractCrudRepository } from 'src/shared/domain/types/base-crud.repository.abstract';
import { TransactionType } from '../entities/transaction-type.entity';

export abstract class AbstractTransactionTypeRepository extends AbstractCrudRepository<TransactionType, string> {
  abstract findByCode(code: string): Promise<TransactionType | null>;
}