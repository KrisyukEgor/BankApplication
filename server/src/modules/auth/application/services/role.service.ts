import { Injectable } from "@nestjs/common";
import { Role, ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { AbstractRoleRepository } from "src/modules/auth/domain/repositories/role.repostory.abstract";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: AbstractRoleRepository) {}

  async getRoleByCode(code: ROLES_ENUM): Promise<Role> {
    const role = await this.roleRepository.findByCode(code);

    if (!role) {
      throw new Error(`Role ${code} not found`); 
    }
    return role;
  }
}