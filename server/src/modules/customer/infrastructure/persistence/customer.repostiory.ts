import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { BaseCrudRepository } from "src/shared/application/ports/base-crud.repository";
import { CustomerMapper } from "../mappers/customer.mapper";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerOrmEntity } from "./orm-entities/customer.orm-entity";
import { AbstractCacheService } from "src/shared/application/ports/cache.service.abstract";

@Injectable()
export class CustomerRepository
  extends BaseCrudRepository<Customer, CustomerOrmEntity, string>
  implements AbstractCustomerRepository
{
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepo: Repository<CustomerOrmEntity>,
    readonly cacheService: AbstractCacheService
  ) {
    super(customerRepo, {
      toDomain: CustomerMapper.toDomain,
      toOrm: CustomerMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: string): string | null {
    return `customers:id:${id}`;
  }

  protected getCacheKeyForAll(): string | null {
    return 'customers:all';
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const key = `customers:phone:${phone}`;
    return this.withCache(key, 300, async () => {
      const ormCustomer = await this.repository.findOne({
        where: { phoneNumber: phone } as any,
      });
      return ormCustomer ? this.mapper.toDomain(ormCustomer) : null;
    });
  }

 
  async findByUserId(userId: string): Promise<Customer | null> {
    const key = `customers:userId:${userId}`;
    return this.withCache(key, 300, async () => {
      const ormCustomer = await this.repository.findOne({
        where: { userId } as any,
      });
      return ormCustomer ? this.mapper.toDomain(ormCustomer) : null;
    });
  }

  protected async invalidateCacheById(id: string): Promise<void> {
    await super.invalidateCacheById(id);
    if (this.cacheService) {
      await this.cacheService.invalidatePattern('customers:*');
    }
  }
}