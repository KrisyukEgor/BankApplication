import { Role } from '../../domain/entities/role.entity';
import { RoleOrmEntity } from '../orm-entities/role.orm-entity';

export class RoleMapper {
  static toDomain(orm: RoleOrmEntity): Role {
    return new Role({
      id: orm.id,
      code: orm.code,
      name: orm.name,
    });
  }

  static toOrm(domain: Role): Partial<RoleOrmEntity> {
    const orm = new RoleOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.code = domain.code;
    orm.name = domain.name;
    return orm;
  }
}
