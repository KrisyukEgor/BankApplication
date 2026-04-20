import { Entity, Column } from 'typeorm';
import { BaseOrmEntity } from 'src/shared/types/base-orm-entity';

@Entity('transaction_types')
export class TransactionTypeOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}