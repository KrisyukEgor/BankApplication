import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { IBaseEntity } from '../../domain/types/ibase.entity';
import { AbstractCrudRepository } from '../../domain/types/base-crud.repository.abstract';
import { AbstractCacheService } from './cache.service.abstract';

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
    },
    protected readonly cacheService?: AbstractCacheService
  ) {
    super(); 
  }

  protected getCacheKeyForId(id: IdType): string | null {
    return null;
  }

  protected getCacheKeyForAll(): string | null {
    return null;
  }

  protected getTTLForId(): number {
    return 300;
  }

  protected getTTLForAll(): number { 
    return 300;
  }

  protected getCachePrefix(): string {
    return this.repository.metadata.tableName;
  }

  protected async withCache<T>(
    key: string | null, 
    ttl: number, 
    fn: () => Promise<T>,
  ): Promise<T> {
    if (!this.cacheService || !key) { 
      return fn();
    }

    try {
      const cached = await this.cacheService.get<T>(key);
      
      if (cached !== null && cached !== undefined) {
        return this.deserialize(cached) as T;
      }
    } catch (error) {
      console.error(`[Cache Error] GET ${key}:`, error);
    }

    const result = await fn();

    try {
      if (result !== null && result !== undefined) {
        const dataToStore = this.serialize(result as unknown as Domain | Domain[]);
        await this.cacheService.set(key, dataToStore, { ttl });
      }
    } catch (error) {
      console.error(`[Cache Error] SET ${key}:`, error);
    }

    return result;
  }

  protected serialize(data: Domain | Domain[]): any {
    if (Array.isArray(data)) {
      return data.map(item => (item as any).props || item);
    }
    return (data as any).props || data;
  }

  protected deserialize(data: any): Domain | Domain[] {
    if (Array.isArray(data)) {
      return data.map(item => this.mapper.toDomain(item));
    }
    return this.mapper.toDomain(data);
  }

  async findById(id: IdType): Promise<Domain | null> {
    return this.withCache(
      this.getCacheKeyForId(id),
      this.getTTLForId(),
      async () => {
        const where = { id } as unknown as FindOptionsWhere<OrmEntity>;
        const entity = await this.repository.findOne({ where });
        return entity ? this.mapper.toDomain(entity) : null;
      }
    )
  }

  async findAll(): Promise<Domain[]> {
     return this.withCache(
      this.getCacheKeyForAll(),
      this.getTTLForAll(),
      async () => {
        const entities = await this.repository.find();
        return entities.map(entity => this.mapper.toDomain(entity));
      }
    );
  }

  async save(domain: Domain): Promise<Domain> {
    const saved = await this.performSave(domain);

    await this.invalidateCacheById(saved.id); 

    return saved;
  }

  async delete(id: IdType): Promise<boolean> {
    const result = await this.repository.delete(id as any);

    if( result.affected !== 0) {
      await this.invalidateCacheById(id);
      return true;
    }

    return false;
  }

  private async performSave(domain: Domain): Promise<Domain> {
    const ormEntity = this.mapper.toOrm(domain);
    const savedEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomain(savedEntity as OrmEntity);
  }

  protected async invalidateCacheById(id: IdType): Promise<void> {
    if (!this.cacheService) {
      return;
    }

    const promises: Promise<any>[] = [];

    const idKey = this.getCacheKeyForId(id);
    if (idKey) {
      promises.push(this.cacheService.del(idKey));
    }

    const allKey = this.getCacheKeyForAll();
    if (allKey) {
      promises.push(this.cacheService.del(allKey));
    }

    const pattern = `${this.getCachePrefix()}:*`;
    promises.push(this.cacheService.invalidatePattern(pattern));

    await Promise.all(promises);
  }
}