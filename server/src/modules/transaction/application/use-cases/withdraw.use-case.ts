import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/application/ports/current-user.service";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { CreateTransactionUseCase } from "./create-transaction.use-case";
import { WithdrawInput } from "../dto/input/withdraw.input.dto";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 


@Injectable()
export class WithdrawUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly transactionRepository: AbstractTransactionRepository,
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(input: WithdrawInput): Promise<void> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) {
      await this.logger.warn('Withdraw failed: profile not found', 'withdraw', userId);
      throw new ForbiddenException('Customer profile not found');
    }

    const account = await this.accountRepository.findById(input.accountId);
    if (!account) {
      await this.logger.warn('Withdraw failed: account not found', 'withdraw', userId, { accountId: input.accountId });
      throw new NotFoundException('Account not found');
    }
    if (account.customerId !== customer.id) {
      await this.logger.warn('Withdraw failed: access denied to account', 'withdraw', userId, { accountId: account.id });
      throw new ForbiddenException('Not your account');
    }

    if (input.amount <= 0) {
      await this.logger.warn('Withdraw failed: non-positive amount', 'withdraw', userId, { amount: input.amount });
      throw new BadRequestException('Amount must be positive');
    }
    if (account.balance < input.amount) {
      await this.logger.warn('Withdraw failed: insufficient funds', 'withdraw', userId, { 
        accountId: account.id, 
        amount: input.amount, 
        currentBalance: account.balance 
      });
      throw new BadRequestException('Insufficient funds');
    }

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

      await this.logger.info('Withdraw completed successfully', 'withdraw', userId, {
        accountId: account.id,
        amount: input.amount,
        txPublicId: transaction.publicId
      });

    } catch (error) {
      transaction.fail();
      await this.transactionRepository.save(transaction);

      await this.logger.error('Withdraw operation failed', error instanceof Error ? error.stack : undefined, 'withdraw', {
        accountId: account.id,
        amount: input.amount,
        txPublicId: transaction.publicId
      });

      throw error;
    }
  }
}
