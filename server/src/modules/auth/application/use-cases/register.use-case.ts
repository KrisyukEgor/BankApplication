import { Injectable } from '@nestjs/common';
import { RegisterInputDTO } from '../dto/input/register.input.dto';
import { RegisterOutputDTO } from '../dto/output/register.output.dto';
import { AbstractUserRepository } from 'src/modules/auth/domain/repositories/user.repository.abstract';
import { AbstractPasswordService } from '../ports/password.service.abstract';
import { ROLES_ENUM } from 'src/modules/auth/domain/entities/role.entity';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { TokenGenerator } from '../services/token-generator.service';
import { UserMapper } from '../mappers/user.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditLogEvent } from 'src/shared/common/autdit-log.event';
import { User } from '../../domain/entities/user.entity';
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly passwordService: AbstractPasswordService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private tokenService: TokenGenerator,
    private eventEmitter: EventEmitter2
  ) {}

  async execute(inputDTO: RegisterInputDTO): Promise<RegisterOutputDTO> {
    await this.userService.ensureEmailUnique(inputDTO.email);
    const role = await this.roleService.getRoleByCode(ROLES_ENUM.USER);
    const hashedPassword = await this.passwordService.hash(inputDTO.password);

    const newUser = new User({
      id: uuidv4(),
      email: inputDTO.email,
      passwordHash: hashedPassword,
      roleId: role.id
    });

    const savedUser = await this.userRepository.save(newUser);

    this.eventEmitter.emit(
      'audit.log',
      new AuditLogEvent(
        'USER_REGISTERED',
        savedUser.id,
        {email: savedUser.email, role: role.code}
      )
    )
    const { accessToken, refreshToken } = await this.tokenService.getTokens(savedUser);

    return UserMapper.toRegisterOutputDTO(savedUser, accessToken, refreshToken);
  }

}