import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { Roles } from "src/shared/common/decorators/roles.decorators";
import { CustomerOutput } from "../../application/dto/output/create-customer.output.dto";
import { CreateCustomerUseCase } from "../../application/use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "../../application/use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "../../application/use-cases/get-customer.use-case";
import { UpdateCustomerUseCase } from "../../application/use-cases/update-customer.use-case";
import { CreateCustomerDto } from "../dto/request/create-customer.dto";
import { CustomerIdParamDto } from "../dto/request/customer-id.param.dto";
import { UpdateCustomerDto } from "../dto/request/update-customer.dto";
import { RolesGuard } from "src/shared/common/guards/roles.guard";
import { JwtAuth } from "src/shared/common/decorators/jwt-auth.decorator";

@Controller('customers')
@JwtAuth()
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post('profile')
  async createProfile(@Body() input: CreateCustomerDto): Promise<CustomerOutput> {
    return this.createCustomerUseCase.execute(input);
  }

  @Get('profile')
  async getMyProfile(): Promise<CustomerOutput> {
    return this.getCustomerUseCase.execute();
  }
  
  @Put('profile')
  async updateMyProfile(@Body() input: UpdateCustomerDto): Promise<CustomerOutput> {
    return this.updateCustomerUseCase.execute(input);
  }

  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyProfile(): Promise<void> {
    return this.deleteCustomerUseCase.execute();
  }

  @Get(':id')
  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.WORKER)
  @UseGuards(RolesGuard)
  async getCustomerById(@Param() params: CustomerIdParamDto): Promise<CustomerOutput> {
    return this.getCustomerUseCase.execute(params.id);
  }

  @Put(':id')
  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.WORKER)
  @UseGuards(RolesGuard)
  async updateCustomerById(
    @Param() params: CustomerIdParamDto,
    @Body() input: UpdateCustomerDto,
  ): Promise<CustomerOutput> {
    return this.updateCustomerUseCase.execute(input, params.id);
  }

  @Delete(':id')
  @Roles(ROLES_ENUM.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomerById(@Param() params: CustomerIdParamDto): Promise<void> {
    return this.deleteCustomerUseCase.execute(params.id);
  }
}