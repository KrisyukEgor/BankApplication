import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudRepository } from 'src/shared/application/ports/base-crud.repository';
import { AbstractRoleRepository } from '../../domain/repositories/role.repostory.abstract';
import { Role } from '../../domain/entities/role.entity';
import { RoleOrmEntity } from '../orm-entities/role.orm-entity';
import { RoleMapper } from '../mappers/role.mapper';
import { CacheTTL } from 'src/shared/application/cache-ttl';
import { AbstractCacheService } from 'src/shared/application/ports/cache.service.abstract';

@Injectable()
export class RoleRepository
  extends BaseCrudRepository<Role, RoleOrmEntity, number>
  implements AbstractRoleRepository
{
  constructor(
    @InjectRepository(RoleOrmEntity) repository: Repository<RoleOrmEntity>,
    cacheService: AbstractCacheService,
  ) {
    super(repository, {
      toDomain: RoleMapper.toDomain,
      toOrm: RoleMapper.toOrm,
    }, cacheService);
  }

  protected getCacheKeyForId(id: number): string | null {
    return `roles:id:${id}`;
  }

  protected getCacheKeyForAll(): string | null {
    return 'roles:all';
  }

  protected getTTLForId(): number {
    return CacheTTL.ROLE_SINGLE;
  }

  protected getTTLForAll(): number {
    return CacheTTL.ROLE_LIST;
  }

  async findByCode(code: string): Promise<Role | null> {
    const cacheKey = `roles:code:${code}`;

    return this.withCache(cacheKey, CacheTTL.ROLE_SINGLE, async () => {
      const orm = await this.repository.findOne({ where: { code } as any });
      return orm ? this.mapper.toDomain(orm) : null;
    });
  }
}