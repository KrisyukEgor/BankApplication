import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorators";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { JwtAuthGuard } from "src/shared/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "src/shared/presentation/guards/roles.guard";


export function isWorker() {
  return applyDecorators(
    Roles (ROLES_ENUM.WORKER),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}