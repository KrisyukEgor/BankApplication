import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleOrmEntity } from "../orm-entities/role.orm-entity";
import { RoleMapper } from "../mappers/role.mapper";
import { BaseCrudRepository } from "src/shared/contracts/base-crud.repository";
import { Role } from "../../domain/entities/role.entity";
import { AbstractRoleRepository } from "../../domain/repositories/role.repostory.abstract";

@Injectable()
export class RoleRepository 
  extends BaseCrudRepository<Role, RoleOrmEntity, number> 
  implements AbstractRoleRepository 
{
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>
  ) {
    super(roleRepo, {
      toDomain: RoleMapper.toDomain,
      toOrm: RoleMapper.toOrm
    });
  }

  async findByCode(code: string): Promise<Role | null> {
    const ormRole = await this.repository.findOne({ 
      where: { code } as any 
    });
    
    return ormRole ? this.mapper.toDomain(ormRole) : null;
  }
}
