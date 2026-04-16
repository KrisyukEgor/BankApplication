import { IsEmail, IsString, Length } from "class-validator";

export class LoginRequestDto {

  @IsEmail({}, {message: 'Invalid email address'})
  email: string;

  @IsString({message: 'Password should be a string'})
  @Length(8, 255, {message: 'Password length should be between 8 and 255'})
  password: string;
}
