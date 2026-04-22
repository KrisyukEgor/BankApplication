import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractUserRepository } from '../../domain/repositories/user.repository.abstract';
import { AbstractPasswordService } from '../../application/ports/password.service.abstract';
import { AbstractRoleRepository } from '../../domain/repositories/role.repostory.abstract';
import { ROLES_ENUM } from '../../domain/entities/role.entity';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {

  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly passwordService: AbstractPasswordService,
    private readonly roleRepository: AbstractRoleRepository,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@gmail.com';
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') ?? '123123123';

    const existingAdmin = await this.userRepository.findByEmail(adminEmail);
    if (existingAdmin) {
      return;
    }

    const adminRole = await this.roleRepository.findByCode(ROLES_ENUM.ADMIN);
    if (!adminRole) {
      return;
    }

    const hashedPassword = await this.passwordService.hash(adminPassword);

    const adminUser = new User({
      id: uuidv4(),
      email: adminEmail,
      passwordHash: hashedPassword,
      roleId: adminRole.id,
    });

    await this.userRepository.save(adminUser);
  }
}