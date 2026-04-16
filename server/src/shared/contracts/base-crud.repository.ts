import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { IBaseEntity } from '../types/ibase.entity';
import { AbstractCrudRepository } from '../types/base-crud.repository.abstract';

export abstract class BaseCrudRepository<
  Domain extends IBaseEntity<IdType>,
  OrmEntity extends IBaseEntity<IdType>,
  IdType = string | number,
> extends AbstractCrudRepository<Domain, IdType> {
  
  constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: {
      toDomain: (orm: OrmEntity) => Domain;
      toOrm: (domain: Domain) => DeepPartial<OrmEntity>;
    }
  ) {
    super(); 
  }

  async findById(id: IdType): Promise<Domain | null> {
    const where = { id } as unknown as FindOptionsWhere<OrmEntity>;
    const entity = await this.repository.findOne({ where });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Domain[]> {
    const entities = await this.repository.find();
    return entities.map(this.mapper.toDomain);
  }

  async save(domain: Domain): Promise<Domain> {
    const ormEntity = this.mapper.toOrm(domain);
    const savedEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomain(savedEntity as OrmEntity);
  }

  async delete(id: IdType): Promise<boolean> {
    const result = await this.repository.delete(id as any);
    return result.affected !== 0;
  }
}
