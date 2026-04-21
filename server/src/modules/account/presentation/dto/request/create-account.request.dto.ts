import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  typeCode: string;
}