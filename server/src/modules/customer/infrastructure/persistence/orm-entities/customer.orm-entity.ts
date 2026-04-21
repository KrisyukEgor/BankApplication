import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseOrmEntity } from 'src/shared/domain/types/base-orm-entity';
import { UserOrmEntity } from 'src/modules/auth/infrastructure/orm-entities/user.orm-entity';


@Entity('customers')
export class CustomerOrmEntity extends BaseOrmEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserOrmEntity;
}