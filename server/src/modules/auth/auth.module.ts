import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AbstractUserRepository } from './domain/repositories/user.repository.abstract';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { AbstractPasswordService } from './application/ports/password.service.abstract';
import { PasswordService } from './infrastructure/services/password.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigService } from 'src/config/services/env.config';
import { AbstractRoleRepository } from './domain/repositories/role.repostory.abstract';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RoleService } from './application/services/role.service';
import { UserService } from './application/services/user.service';
import { TokenGenerator } from './application/services/token-generator.service';
import { AbstractTokenService } from './application/ports/token.service.abstract';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm-entities/user.orm-entity';
import { RoleOrmEntity } from './infrastructure/orm-entities/role.orm-entity';
import { RoleDbSeedService } from './infrastructure/persistence/role-db-seed.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: EnvConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: '4h'
        }
      }),
      inject: [EnvConfigService]
    }),
    TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])
  ],
  controllers: [AuthController],
  providers: [
    RoleDbSeedService,
    RegisterUseCase,
    LoginUseCase,
    RoleService,
    UserService,
    TokenGenerator,
    {
      provide: AbstractUserRepository,
      useClass: UserRepository
    },
    {
      provide: AbstractPasswordService,
      useClass: PasswordService,
    },
    {
      provide: AbstractRoleRepository,
      useClass: RoleRepository,
    },
    {
      provide: AbstractTokenService,
      useClass: JwtTokenService
    }
  ],
  exports: [AbstractUserRepository]
})
export class AuthModule {}
