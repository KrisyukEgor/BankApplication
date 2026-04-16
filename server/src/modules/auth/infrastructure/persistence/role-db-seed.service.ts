import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../orm-entities/role.orm-entity';
import { ROLES_ENUM } from '../../domain/entities/role.entity';

@Injectable()
export class RoleDbSeedService implements OnApplicationBootstrap {

  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
    const roles = Object.values(ROLES_ENUM); 

    for (const code of roles) {
      const exists = await this.roleRepository.findOneBy({ code });

      if (!exists) {
        
        const role = this.roleRepository.create({
          code: code,
          name: this.formatName(code),
        });

        await this.roleRepository.save(role);
      }
    }
  }

  private formatName(code: string): string {
    return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
  }
}
