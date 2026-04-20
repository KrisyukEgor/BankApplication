import { Controller, Post, Body, Get, Param, NotFoundException, HttpCode, HttpStatus, Delete, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ROLES_ENUM } from "src/modules/auth/domain/entities/role.entity";
import { JwtAuth } from "src/shared/common/decorators/jwt-auth.decorator";
import { Roles } from "src/shared/common/decorators/roles.decorators";
import { RolesGuard } from "src/shared/common/guards/roles.guard";
import { AccountOutput } from "../../application/dto/output/account.output.dto";
import { CloseAccountUseCase } from "../../application/use-cases/close-account.use-case";
import { GetAccountsUseCase } from "../../application/use-cases/get-accounts.use-case";
import { OpenAccountUseCase } from "../../application/use-cases/open-account.use-case";
import { AccountIdParamDto } from "../dto/param/account-id.param.dto";
import { CreateAccountDto } from "../dto/request/create-account.request.dto";
import { DepositWithdrawDto } from "../dto/request/deposit-withdraw.dto";
import { TransferDto } from "../dto/request/transfer.dto";

@ApiTags('accounts')
@Controller('accounts')
@JwtAuth()
export class AccountController {
  constructor(
    private readonly openAccountUseCase: OpenAccountUseCase,
    private readonly getAccountsUseCase: GetAccountsUseCase,
    private readonly closeAccountUseCase: CloseAccountUseCase,
  ) {}

  @Post()
  async openAccount(@Body() dto: CreateAccountDto): Promise<AccountOutput> {
    return this.openAccountUseCase.execute(dto);
  }

  @Get()
  async getMyAccounts(): Promise<AccountOutput[]> {
    return this.getAccountsUseCase.execute();
  }

  @Get(':id')
  async getAccountById(@Param() params: AccountIdParamDto): Promise<AccountOutput> {
    const accounts = await this.getAccountsUseCase.execute();
    const account = accounts.find(a => a.id === params.id);
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async closeAccount(@Param() params: AccountIdParamDto): Promise<void> {
    await this.closeAccountUseCase.execute(params.id);
  }

  @Get('customer/:customerId')
  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.WORKER)
  @UseGuards(RolesGuard)
  async getAccountsByCustomer(@Param('customerId') customerId: string): Promise<AccountOutput[]> {
    return this.getAccountsUseCase.execute(customerId);
  }
}