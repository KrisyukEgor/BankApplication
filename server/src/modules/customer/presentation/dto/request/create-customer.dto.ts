import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  middleName?: string;

  @ApiProperty({
    example: '+37525444444444'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;
}