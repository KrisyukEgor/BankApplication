import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorators";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { RolesGuard } from "src/shared/presentation/guards/roles.guard";
import { JwtAuthGuard } from "src/shared/presentation/guards/jwt-auth.guard";

export function isAdmin() {
  return applyDecorators(
    Roles (ROLES_ENUM.ADMIN),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}