import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginInputDTO } from "../dto/input/login.input.dto";
import { LoginOutputDTO } from "../dto/output/login.output.dto";
import { TokenGenerator } from "../services/token-generator.service";
import { UserMapper } from "../mappers/user.mapper";
import { AbstractPasswordService } from "../ports/password.service.abstract";
import { AbstractUserRepository } from "../../domain/repositories/user.repository.abstract";

@Injectable()
export class LoginUseCase {

  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly passwordService: AbstractPasswordService,
    private readonly tokenService: TokenGenerator,
  ) {}
  
  async execute(inputDto: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByEmail(inputDto.email);
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordValid = await this.passwordService.compare(
      inputDto.password,
      user.passwordHash
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const { accessToken, refreshToken } = await this.tokenService.getTokens(user);

    return UserMapper.toLoginOutputDTO(user, accessToken, refreshToken);
  }
}