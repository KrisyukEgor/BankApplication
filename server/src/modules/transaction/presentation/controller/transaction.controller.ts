import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuth } from "src/shared/common/decorators/jwt-auth.decorator";
import { TransactionOutput } from "../../application/dto/output/transaction.output.dto";
import { DepositUseCase } from "../../application/use-cases/deposit.use-case";
import { GetTransactionsUseCase } from "../../application/use-cases/get-transactions.use-case";
import { TransferUseCase } from "../../application/use-cases/transfer.use-case";
import { DepositDto } from "../dto/request/deposit.dto";
import { TransferDto } from "../dto/request/transfer.dto";
import { WithdrawDto } from "../dto/request/withdraw.dto";
import { WithdrawUseCase } from "../../application/use-cases/withdraw.use-case";

@ApiTags('transactions')
@Controller('transactions')
@JwtAuth()
export class TransactionController {
  constructor(
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly transferUseCase: TransferUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Post('deposit')
  async deposit(@Body() dto: DepositDto): Promise<{ message: string }> {
    await this.depositUseCase.execute(dto);
    return { message: 'Deposit successful' };
  }

  @Post('withdraw')
  async withdraw(@Body() dto: WithdrawDto): Promise<{ message: string }> {
    await this.withdrawUseCase.execute(dto);
    return { message: 'Withdrawal successful' };
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferDto): Promise<{ message: string }> {
    await this.transferUseCase.execute(dto);
    return { message: 'Transfer successful' };
  }

  @Get()
  async getTransactions(
    @Query('accountId') accountId?: string,
    @Query('customerId') customerId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TransactionOutput[]> {
    return this.getTransactionsUseCase.execute({ accountId, customerId, limit, offset });
  }
}