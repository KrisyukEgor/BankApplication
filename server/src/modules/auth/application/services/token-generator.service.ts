import { User } from "src/modules/auth/domain/entities/user.entity";
import { AbstractTokenService } from "../ports/token.service.abstract";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenGenerator {
  constructor(private readonly tokenService: AbstractTokenService) {}

  async getTokens(user: User) {
    const payload = {
      sub: String(user.id),
      email: user.email,
      role: user.role?.code || ROLES_ENUM.USER, 
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateToken(payload, { expiresIn: '15m' }),
      this.tokenService.generateToken(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }
}