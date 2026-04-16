import { PartialType } from '@nestjs/mapped-types';
import { RegisterRequestDto } from './request/register.request.dto';

export class UpdateUserDto extends PartialType(RegisterRequestDto) {}
