import { User } from "src/modules/auth/domain/entities/user.entity";
import { RegisterOutputDTO } from "../dto/output/register.output.dto";
import { LoginOutputDTO } from "../dto/output/login.output.dto";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";


export class UserMapper {
  static toRegisterOutputDTO(user: User, accessToken: string, refreshToken: string): RegisterOutputDTO {
    return this.getOutputDto(user, accessToken, refreshToken);
  }

  static toLoginOutputDTO(user: User, accessToken: string, refreshToken: string): LoginOutputDTO {
    return this.getOutputDto(user, accessToken, refreshToken);
  }

  private static getOutputDto(user: User, accessToken: string, refreshToken: string) {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.code || ROLES_ENUM.USER,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens: {
        accessToken,
        refreshToken, 
      }
    };
  }
}