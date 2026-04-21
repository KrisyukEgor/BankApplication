import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IBaseEntity } from 'src/shared/domain/types/ibase.entity';

@Entity('roles')
export class RoleOrmEntity implements IBaseEntity<number> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
