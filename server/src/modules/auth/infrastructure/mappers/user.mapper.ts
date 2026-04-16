import { User } from "../../domain/entities/user.entity";
import { UserOrmEntity } from "../orm-entities/user.orm-entity";

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): User {
    return new User({
      id: ormEntity.id,
      email: ormEntity.email,
      passwordHash: ormEntity.passwordHash,
      roleId: ormEntity.roleId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toOrm(domainUser: User): Partial<UserOrmEntity> {
    const ormEntity = new UserOrmEntity();
    
    if (domainUser.id) ormEntity.id = domainUser.id;
    
    ormEntity.email = domainUser.email;
    ormEntity.passwordHash = domainUser.passwordHash;
    ormEntity.roleId = domainUser.roleId;
    
    return ormEntity;
  }
}
