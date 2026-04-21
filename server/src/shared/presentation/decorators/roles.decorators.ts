import { SetMetadata } from '@nestjs/common';
import { ROLES_ENUM } from 'src/modules/auth/domain/entities/role.entity';

export const Roles = (...roles: ROLES_ENUM[]) => SetMetadata('roles', roles);