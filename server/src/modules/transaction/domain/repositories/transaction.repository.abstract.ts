import { AbstractCrudRepository } from 'src/shared/domain/types/base-crud.repository.abstract';
import { TransactionDomain } from '../entities/transaction.entity';

export abstract class AbstractTransactionRepository extends AbstractCrudRepository<TransactionDomain, string> {
  abstract findByPublicId(publicId: string): Promise<TransactionDomain | null>;
  abstract findByAccountId(accountId: string, limit?: number, offset?: number): Promise<TransactionDomain[]>;
  abstract findByCustomerId(customerId: string, limit?: number, offset?: number): Promise<TransactionDomain[]>;
}