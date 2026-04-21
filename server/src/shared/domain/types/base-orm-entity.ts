import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IBaseEntity } from './ibase.entity';


export abstract class BaseOrmEntity implements IBaseEntity<string> {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
