import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AbstractUserRepository } from "src/modules/auth/domain/repositories/user.repository.abstract";
import { AbstractPasswordService } from "../ports/password.service.abstract";
import { User } from "src/modules/auth/domain/entities/user.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: AbstractUserRepository) {}

  async ensureEmailUnique(email: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  async validateCredentials(email: string, password: string, passwordService: AbstractPasswordService): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await passwordService.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
