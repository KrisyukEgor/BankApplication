import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseOrmEntity } from 'src/shared/types/base-orm-entity';
import { TransactionTypeOrmEntity } from './transaction-type.orm-entity';
import { TransactionStatusOrmEntity } from './transaction-status.orm-entity';

@Entity('transactions')
export class TransactionOrmEntity extends BaseOrmEntity {
  @Column({ name: 'public_id', unique: true })
  publicId: string;

  @Column({ name: 'from_account_id', nullable: true, type: 'uuid' })
  fromAccountId?: string;

  @Column({ name: 'to_account_id', nullable: true, type: 'uuid' })
  toAccountId?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'type_id' })
  typeId: string;

  @Column({ name: 'status_id' })
  statusId: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => TransactionTypeOrmEntity)
  @JoinColumn({ name: 'type_id' })
  transactionType?: TransactionTypeOrmEntity;

  @ManyToOne(() => TransactionStatusOrmEntity)
  @JoinColumn({ name: 'status_id' })
  transactionStatus?: TransactionStatusOrmEntity;
}