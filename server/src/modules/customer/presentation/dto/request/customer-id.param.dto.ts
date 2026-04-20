import { IsUUID } from 'class-validator';

export class CustomerIdParamDto {
  @IsUUID()
  id: string;
}