import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseOrmEntity } from 'src/shared/types/base-orm-entity';
import { AccountTypeOrmEntity } from './account-type.orm-entity';

@Entity('accounts')
export class AccountOrmEntity extends BaseOrmEntity {
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ unique: true })
  number: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'type_id' })
  typeId: string;           

  @ManyToOne(() => AccountTypeOrmEntity)
  @JoinColumn({ name: 'type_id' })
  accountType?: AccountTypeOrmEntity;
}