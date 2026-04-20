import { BaseOrmEntity } from "src/shared/types/base-orm-entity";
import { Entity, Column } from "typeorm";

@Entity('transaction_statuses')
export class TransactionStatusOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}