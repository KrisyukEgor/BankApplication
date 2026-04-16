import { IBaseEntity } from "./ibase.entity";

export abstract class AbstractCrudRepository<
  T extends IBaseEntity<IdType>,
  IdType = string | number,
> {
  abstract findById(id: IdType): Promise<T | null>;
  abstract findAll(): Promise<T[]>;

  abstract save(entity: T): Promise<T>

  abstract delete(id: IdType): Promise<boolean>;
}