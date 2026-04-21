import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/application/ports/current-user.service";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { TransferInput } from "../dto/input/transfer.input.interface";
import { CreateTransactionUseCase } from "./create-transaction.use-case";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 

@Injectable()
export class TransferUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly transactionRepository: AbstractTransactionRepository, 
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(input: TransferInput): Promise<void> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) {
      await this.logger.warn('Transfer failed: profile not found', 'transfer', userId);
      throw new ForbiddenException('Customer profile not found');
    }

    const fromAccount = await this.accountRepository.findById(input.fromAccountId);
    if (!fromAccount) {
      await this.logger.warn('Transfer failed: source account not found', 'transfer', userId, { fromAccountId: input.fromAccountId });
      throw new NotFoundException('Source account not found');
    }
    if (fromAccount.customerId !== customer.id) {
      await this.logger.warn('Transfer failed: access denied to source account', 'transfer', userId, { fromAccountId: fromAccount.id });
      throw new ForbiddenException('You can only transfer from your own accounts');
    }

    const toAccount = await this.accountRepository.findById(input.toAccountId);
    if (!toAccount) {
      await this.logger.warn('Transfer failed: destination account not found', 'transfer', userId, { toAccountId: input.toAccountId });
      throw new NotFoundException('Destination account not found');
    }

    if (input.amount <= 0) {
      await this.logger.warn('Transfer failed: non-positive amount', 'transfer', userId, { amount: input.amount });
      throw new BadRequestException('Amount must be positive');
    }
    if (fromAccount.balance < input.amount) {
      await this.logger.warn('Transfer failed: insufficient funds', 'transfer', userId, { 
        fromAccountId: fromAccount.id, 
        amount: input.amount, 
        currentBalance: fromAccount.balance 
      });
      throw new BadRequestException('Insufficient funds');
    }

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

      await this.logger.info('Transfer completed successfully', 'transfer', userId, {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: input.amount,
        txPublicId: transaction.publicId
      });

    } catch (error) {
      transaction.fail();
      await this.transactionRepository.save(transaction);

      await this.logger.error('Transfer operation failed', error instanceof Error ? error.stack : undefined, 'transfer', {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: input.amount,
        txPublicId: transaction.publicId
      });

      throw error;
    }
  }
}
