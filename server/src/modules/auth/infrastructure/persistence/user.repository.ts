import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AbstractUserRepository } from 'src/modules/auth/domain/repositories/user.repository.abstract';
import { BaseCrudRepository } from "src/shared/contracts/base-crud.repository";
import { UserMapper } from "../mappers/user.mapper";
import { UserOrmEntity } from "../orm-entities/user.orm-entity";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class UserRepository 
  extends BaseCrudRepository<User, UserOrmEntity, string> 
  implements AbstractUserRepository 
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>
  ) {
    super(userRepo, {
      toDomain: UserMapper.toDomain,
      toOrm: UserMapper.toOrm
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.repository.findOne({ 
      where: { email } as any 
    });
    
    return ormUser ? this.mapper.toDomain(ormUser) : null;
  }
}
