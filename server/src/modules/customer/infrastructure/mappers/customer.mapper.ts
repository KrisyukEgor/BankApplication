import { DeepPartial } from 'typeorm';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../persistence/orm-entities/customer.orm-entity';

export class CustomerMapper {
  static toDomain(ormEntity: CustomerOrmEntity): Customer {
    return new Customer({
      id: ormEntity.id,
      userId: ormEntity.userId,
      firstName: ormEntity.firstName,
      lastName: ormEntity.lastName,
      middleName: ormEntity.middleName || '',
      phoneNumber: ormEntity.phoneNumber,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrm(domain: Customer): DeepPartial<CustomerOrmEntity> {
    const orm = new CustomerOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.userId = domain.userId;
    orm.firstName = domain.firstName;
    orm.lastName = domain.lastName;
    orm.middleName = domain.middleName;
    orm.phoneNumber = domain.phoneNumber;
    return orm;
  }
}