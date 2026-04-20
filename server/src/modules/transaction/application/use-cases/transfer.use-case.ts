import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { TransferInput } from "../dto/input/transfer.input.interface";
import { CreateTransactionUseCase } from "./create-transaction.use-case";

@Injectable()
export class TransferUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly transactionRepository: AbstractTransactionRepository, 
  ) {}

  async execute(input: TransferInput): Promise<void> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) throw new ForbiddenException('Customer profile not found');

    const fromAccount = await this.accountRepository.findById(input.fromAccountId);
    if (!fromAccount) throw new NotFoundException('Source account not found');
    if (fromAccount.customerId !== customer.id) throw new ForbiddenException('You can only transfer from your own accounts');

    const toAccount = await this.accountRepository.findById(input.toAccountId);
    if (!toAccount) throw new NotFoundException('Destination account not found');

    if (input.amount <= 0) throw new BadRequestException('Amount must be positive');
    if (fromAccount.balance < input.amount) throw new BadRequestException('Insufficient funds');

    const transaction = await this.createTransaction.execute({
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: input.amount,
      typeCode: 'TRANSFER',
      description: input.description,
    });

    try {
      fromAccount.withdraw(input.amount);
      toAccount.deposit(input.amount);
      await this.accountRepository.save(fromAccount);
      await this.accountRepository.save(toAccount);
      transaction.complete();
      await this.transactionRepository.save(transaction);
    } catch (error) {
      transaction.fail();
      await this.transactionRepository.save(transaction);
      throw error;
    }
  }
}