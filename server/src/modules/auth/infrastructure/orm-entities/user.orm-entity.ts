import { BaseOrmEntity } from 'src/shared/types/base-orm-entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('users')
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'role_id' })
  role?: RoleOrmEntity;
}
