import { AbstractCrudRepository } from 'src/shared/domain/types/base-crud.repository.abstract';
import { TransactionStatus } from '../entities/transaction-status.entity';

export abstract class AbstractTransactionStatusRepository extends AbstractCrudRepository<TransactionStatus, string> {
  abstract findByCode(code: string): Promise<TransactionStatus | null>;
}