import { Injectable, Optional } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AbstractUserRepository } from 'src/modules/auth/domain/repositories/user.repository.abstract';
import { BaseCrudRepository } from "src/shared/contracts/base-crud.repository";
import { UserMapper } from "../mappers/user.mapper";
import { UserOrmEntity } from "../orm-entities/user.orm-entity";
import { User } from "../../domain/entities/user.entity";
import { AbstractCacheService } from "src/shared/contracts/cache.service.abstract";
import { CacheTTL } from "src/shared/contracts/cache-ttl";

@Injectable()
export class UserRepository 
  extends BaseCrudRepository<User, UserOrmEntity, string> 
  implements AbstractUserRepository 
{
  constructor(
    @InjectRepository(UserOrmEntity) private readonly userRepo: Repository<UserOrmEntity>,
    cacheService?: AbstractCacheService 
  ) {
    super(userRepo, {
      toDomain: UserMapper.toDomain,
      toOrm: UserMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: string): string | null {
    return `users:id:${id}`
  }

  protected getCacheKeyForAll(): string | null {
    return 'users:all'
  }

  protected getTTLForId(): number {
    return CacheTTL.USER_SINGLE;
  }

  protected getTTLForAll(): number {
    return CacheTTL.USER_LIST;
  }

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `users:email:${email}`;
    
    return this.withCache(cacheKey, CacheTTL.USER_SINGLE, async () => {
      const ormUser = await this.repository.findOne({ where: { email } as any });
      return ormUser ? this.mapper.toDomain(ormUser) : null;
    });
  }
}
