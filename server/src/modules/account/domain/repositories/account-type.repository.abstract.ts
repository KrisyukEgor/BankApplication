import { AbstractCrudRepository } from 'src/shared/domain/types/base-crud.repository.abstract';
import { AccountType } from '../entities/account-type.entity';

export abstract class AbstractAccountTypeRepository extends AbstractCrudRepository<AccountType, string> {
  abstract findByCode(code: string): Promise<AccountType | null>;
}