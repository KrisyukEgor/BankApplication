import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { DepositInput } from "../dto/input/deposit.input.dto";
import { CreateTransactionUseCase } from "./create-transaction.use-case";

@Injectable()
export class DepositUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly transactionRepository: AbstractTransactionRepository, 
  ) {}

  async execute(input: DepositInput): Promise<void> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) throw new ForbiddenException('Customer profile not found');

    const account = await this.accountRepository.findById(input.accountId);
    if (!account) throw new NotFoundException('Account not found');
    if (account.customerId !== customer.id) throw new ForbiddenException('Not your account');

    const transaction = await this.createTransaction.execute({
      toAccountId: account.id,
      amount: input.amount,
      typeCode: 'DEPOSIT',
      description: input.description,
    });

    try {
      account.deposit(input.amount);
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