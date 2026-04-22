import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { RolesGuard } from "../guards/roles.guard";
import { ApiForbiddenResponse, ApiOperation } from "@nestjs/swagger";

export function AuthRoles(...roles: ROLES_ENUM[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
    ApiOperation({ 
      summary: `[Роли: ${roles.join(', ')}]` 
    }),
    ApiForbiddenResponse({ 
      description: `Доступ запрещен. Требуются роли: ${roles.join(', ')}` 
    }),
  )
}