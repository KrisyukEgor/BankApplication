import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorators";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";


export function isWorker() {
  return applyDecorators(
    Roles (ROLES_ENUM.WORKER),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}