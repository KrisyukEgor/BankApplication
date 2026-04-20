import { IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class DepositDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}