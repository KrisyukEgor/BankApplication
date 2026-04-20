import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateCustomerRequestDTO {
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName cannot be empty' })
  @Length(2, 50, { message: 'firstName must be between 2 and 50 characters' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName cannot be empty' })
  @Length(2, 50, { message: 'lastName must be between 2 and 50 characters' })
  lastName: string;

  @IsString({ message: 'middleName must be a string' })
  @Length(2, 50, { message: 'middleName must be between 2 and 50 characters' })
  middleName: string;

  @IsString({ message: 'phoneNumber must be a string' })
  @IsNotEmpty({ message: 'phoneNumber cannot be empty' })
  phoneNumber: string;
}