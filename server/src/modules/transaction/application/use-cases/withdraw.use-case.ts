import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { CreateTransactionUseCase } from "./create-transaction.use-case";
import { WithdrawInput } from "../dto/input/withdraw.input.dto";


@Injectable()
export class WithdrawUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly transactionRepository: AbstractTransactionRepository,
  ) {}

  async execute(input: WithdrawInput): Promise<void> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) throw new ForbiddenException('Customer profile not found');

    const account = await this.accountRepository.findById(input.accountId);
    if (!account) throw new NotFoundException('Account not found');
    if (account.customerId !== customer.id) throw new ForbiddenException('Not your account');

    if (input.amount <= 0) throw new BadRequestException('Amount must be positive');
    if (account.balance < input.amount) throw new BadRequestException('Insufficient funds');

    const transaction = await this.createTransaction.execute({
      fromAccountId: account.id,
      amount: input.amount,
      typeCode: 'WITHDRAW',
      description: input.description,
    });

    try {
      account.withdraw(input.amount);
      await this.accountRepository.save(account);
      transaction.complete();
      await this.transactionRepository.save(transaction);
    } catch (error) {
      transaction.fail();
      await this.transactionRepository.save(transaction);
      throw error;
    }
  }
}