import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginInputDTO } from "../dto/input/login.input.dto";
import { LoginOutputDTO } from "../dto/output/login.output.dto";
import { TokenGenerator } from "../services/token-generator.service";
import { UserMapper } from "../mappers/user.mapper";
import { AbstractPasswordService } from "../ports/password.service.abstract";
import { AbstractUserRepository } from "../../domain/repositories/user.repository.abstract";
import { AbstractLoginAttemptsRepository } from "../ports/login-attempts.repository.abstract";
@Injectable()
export class LoginUseCase {

  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly passwordService: AbstractPasswordService,
    private readonly tokenService: TokenGenerator,
    private readonly loginAttemptsRepo: AbstractLoginAttemptsRepository,
  ) {}
  
  async execute(inputDto: LoginInputDTO): Promise<LoginOutputDTO> {
    const { email, password } = inputDto;

    const isBlocked = await this.loginAttemptsRepo.isBlocked(email);
    if (isBlocked) {
      throw new ForbiddenException('Account is temporarily blocked due to too many failed attempts. Try again later.');
    }
    
    const user = await this.userRepository.findByEmail(email);
    if (!user) {

      await this.handleFailedAttempt(email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.handleFailedAttempt(email);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.loginAttemptsRepo.resetAttempts(email);
    
    const { accessToken, refreshToken } = await this.tokenService.getTokens(user);

    return UserMapper.toLoginOutputDTO(user, accessToken, refreshToken);
  }

   private async handleFailedAttempt(email: string): Promise<void> {
    const attempts = await this.loginAttemptsRepo.incrementAttempts(email);
    if (attempts >= 3) {
      await this.loginAttemptsRepo.block(email, 600); 
    }
  }
}