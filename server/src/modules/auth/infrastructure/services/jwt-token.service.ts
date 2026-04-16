import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AbstractTokenService, TokenPayload } from "src/modules/auth/application/ports/token.service.abstract";

@Injectable()
export class JwtTokenService implements AbstractTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token);
  }
}
