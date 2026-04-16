import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { RegisterUseCase } from 'src/modules/auth/application/use-cases/register.use-case';
import { RegisterInputDTO } from 'src/modules/auth/application/dto/input/register.input.dto';
import { LoginInputDTO } from 'src/modules/auth/application/dto/input/login.input.dto';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  @Post('/register')
  async register(@Body() requestDTO: RegisterRequestDto) {
    const inputDTO: RegisterInputDTO = {
      email: requestDTO.email,
      password: requestDTO.password
    }

    const result = await this.registerUseCase.execute(inputDTO);

    return result;
  }

  @Post('/login') 
  async login (@Body() requestDto: LoginRequestDto) {
    const inputDto: LoginInputDTO = {
      email: requestDto.email,
      password: requestDto.password
    }

    const result = await this.loginUseCase.execute(inputDto);

    return result;
  }
}
