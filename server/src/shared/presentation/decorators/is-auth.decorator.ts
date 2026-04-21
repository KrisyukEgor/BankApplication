import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/shared/presentation/guards/jwt-auth.guard";

export function isAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard)
  )
}