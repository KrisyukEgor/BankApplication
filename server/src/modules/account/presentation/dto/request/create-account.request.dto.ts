import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(CHECKING|SAVINGS|CREDIT)$/, { message: 'Invalid account type code' })
  typeCode: string;
}