import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AbstractTokenService } from 'src/modules/auth/application/ports/token.service.abstract';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: AbstractTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('All headers:', request.headers);
  console.log('Authorization header:', request.headers.authorization);
  
    const token = this.extractTokenFromHeader(request);
    console.log('Token received:', token);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.tokenService.verifyToken(token);
      console.log('Payload:', payload);
      request.user = payload;
      return true;
    } catch (err) {
      console.error('Verification error:', err.message);
      throw new UnauthorizedException();
    }
  }
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}