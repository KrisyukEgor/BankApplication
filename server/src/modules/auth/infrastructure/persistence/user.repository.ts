import { Injectable, Optional } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AbstractUserRepository } from 'src/modules/auth/domain/repositories/user.repository.abstract';
import { BaseCrudRepository } from "src/shared/application/ports/base-crud.repository";
import { UserMapper } from "../mappers/user.mapper";
import { UserOrmEntity } from "../orm-entities/user.orm-entity";
import { User } from "../../domain/entities/user.entity";
import { AbstractCacheService } from "src/shared/application/ports/cache.service.abstract";
import { CacheTTL } from "src/shared/application/cache-ttl";
import { Role } from "../../domain/entities/role.entity";

@Injectable()
export class UserRepository 
  extends BaseCrudRepository<User, UserOrmEntity, string> 
  implements AbstractUserRepository 
{
  constructor(
    @InjectRepository(UserOrmEntity) private readonly userRepo: Repository<UserOrmEntity>,
    cacheService: AbstractCacheService 
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

  protected serialize(domain: User): any {
    return {
      id: domain.id,
      email: domain.email,
      passwordHash: domain.passwordHash,
      roleId: domain.roleId,
      role: domain.role ? {
        id: domain.role.id,
        code: domain.role.code,
        name: domain.role.name,
      } : null,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  protected deserialize(data: any): User {
    const role = data.role ? new Role({
      id: data.role.id,
      code: data.role.code,
      name: data.role.name,
    }) : undefined;
    return new User({
      id: data.id,
      email: data.email,
      passwordHash: data.passwordHash,
      roleId: data.roleId,
      role,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `users:email:${email}`;
    
    return this.withCache(cacheKey, CacheTTL.USER_SINGLE, async () => {
      const ormUser = await this.repository.findOne({ 
        where: { email } as any,
        relations: ['role']
      });
      return ormUser ? this.mapper.toDomain(ormUser) : null;
    });
  }

  // async findByEmail(email: string): Promise<User | null> {
  //   const ormUser = await this.repository.findOne({ where: { email } as any, relations: ['role'] });
  //   return ormUser ? this.mapper.toDomain(ormUser) : null;
  // }

  protected async invalidateCacheById(id: string): Promise<void> {
    await super.invalidateCacheById(id);

    if (!this.cacheService) return;

    const pattern = 'users:email:*';
    await this.cacheService.invalidatePattern(pattern);
  }
}
