import { IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class WithdrawDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}