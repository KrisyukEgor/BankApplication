import { AbstractCrudRepository } from "src/shared/types/base-crud.repository.abstract";
import { Role } from "../entities/role.entity";

export abstract class AbstractRoleRepository extends AbstractCrudRepository<Role> {
  abstract findByCode(code: string): Promise<Role | null>;
}