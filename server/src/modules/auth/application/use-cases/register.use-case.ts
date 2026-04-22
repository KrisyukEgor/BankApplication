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
import { User } from '../../domain/entities/user.entity';
import {v4 as uuidv4} from 'uuid'
import { AbstractLogger } from 'src/shared/application/ports/logger.abstract';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly passwordService: AbstractPasswordService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly logger: AbstractLogger,
    private tokenService: TokenGenerator,
  ) {}

  async execute(inputDTO: RegisterInputDTO): Promise<RegisterOutputDTO> {
    await this.userService.ensureEmailUnique(inputDTO.email);
    console.log('1 unique checked');
    const role = await this.roleService.getRoleByCode(ROLES_ENUM.USER);
    console.log('2 role', role);
    const hashedPassword = await this.passwordService.hash(inputDTO.password);
    console.log('3 hashed');
    
    console.log(role);
    
    const newUser = new User({
      id: uuidv4(),
      email: inputDTO.email,
      passwordHash: hashedPassword,
      roleId: role.id
    });

    const savedUser = await this.userRepository.save(newUser);
     console.log('4 savedUser', savedUser);

    await this.logger.info(
      `User registered: ${savedUser.email}`,
      'auth',
      savedUser.id,
      { email: savedUser.email, role: role.code }
    );
    console.log('5 logger ok');


    const { accessToken, refreshToken } = await this.tokenService.getTokens(savedUser);
    console.log('6 tokens ok');

    return UserMapper.toRegisterOutputDTO(savedUser, accessToken, refreshToken);
  }

}