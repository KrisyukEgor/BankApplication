import { AbstractCrudRepository } from 'src/shared/types/base-crud.repository.abstract';
import { Account } from '../entities/account.entity';

export abstract class AbstractAccountRepository extends AbstractCrudRepository<Account, string> {
  abstract findByCustomerId(customerId: string): Promise<Account[]>;
  abstract findByNumber(number: string): Promise<Account | null>;
}