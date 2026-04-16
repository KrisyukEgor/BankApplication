import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get dbUser(): string {
    return this.configService.get<string>('DB_USERNAME', 'aboba');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'password');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME', 'bank_app');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', "12312")
  }
}
