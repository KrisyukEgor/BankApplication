import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/contracts/base-crud.repository';
import { CustomerMapper } from '../mappers/customer.mapper';
import { Customer } from '../../domain/entities/customer.entity';
import { AbstractCustomerRepository } from '../../domain/repositories/customer.repository.abstract';
import { CustomerOrmEntity } from '../persistence/orm-entities/customer.orm-entity';

@Injectable()
export class CustomerRepository
  extends BaseCrudRepository<Customer, CustomerOrmEntity, string>
  implements AbstractCustomerRepository
{
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepo: Repository<CustomerOrmEntity>,
  ) {
    super(customerRepo, {
      toDomain: CustomerMapper.toDomain,
      toOrm: CustomerMapper.toOrm,
    });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const orm = await this.repository.findOne({ where: { phoneNumber: phone } as any });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    const orm = await this.repository.findOne({ where: { userId } as any });
    return orm ? this.mapper.toDomain(orm) : null;
  }
}