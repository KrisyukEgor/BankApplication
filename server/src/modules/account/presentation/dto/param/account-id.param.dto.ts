import { IsUUID } from 'class-validator';

export class AccountIdParamDto {
  @IsUUID()
  id: string;
}