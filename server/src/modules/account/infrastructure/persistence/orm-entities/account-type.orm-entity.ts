import { BaseOrmEntity } from "src/shared/domain/types/base-orm-entity";
import { Entity, Column } from "typeorm";

@Entity('account_types')
export class AccountTypeOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}