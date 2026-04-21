import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTransactionsDto {
  @ApiPropertyOptional({ description: 'ID аккаунта для фильтрации' })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ description: 'Начальная дата (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Конечная дата (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Фильтр по типу транзакции' })
  @IsOptional()
  @IsString()
  typeCode?: string;

  @ApiPropertyOptional({ description: 'Фильтр по статусу транзакции' })
  @IsOptional()
  @IsString()
  statusCode?: string;
}
