import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export class DepositRequestDTO {
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  accountId: string;

  @IsNumber({}, { message: 'amount должно быть числом' })
  @IsNotEmpty({ message: 'amount не может быть пустым' }) 
  @IsPositive({ message: 'amount должно быть положительным числом' }) 
  amount: number; 
}