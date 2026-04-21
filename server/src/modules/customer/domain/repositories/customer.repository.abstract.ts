import { AbstractCrudRepository } from 'src/shared/domain/types/base-crud.repository.abstract';
import { Customer } from '../entities/customer.entity';

export abstract class AbstractCustomerRepository extends AbstractCrudRepository<Customer, string> {
  abstract findByPhone(phone: string): Promise<Customer | null>;
  abstract findByUserId(userId: string): Promise<Customer | null>;
}