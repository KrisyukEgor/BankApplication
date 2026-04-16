import { AbstractCrudRepository } from "src/shared/types/base-crud.repository.abstract";
import { User } from "../entities/user.entity";

export abstract class AbstractUserRepository extends AbstractCrudRepository<User, string> {
  abstract findByEmail(email: string): Promise<User | null>;

}