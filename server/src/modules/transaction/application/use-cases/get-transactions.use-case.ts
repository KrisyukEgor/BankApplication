import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AbstractTransactionRepository } from '../../domain/repositories/transaction.repository.abstract';
import { AbstractTransactionTypeRepository } from '../../domain/repositories/transaction-type.repository.abstract';
import { AbstractTransactionStatusRepository } from '../../domain/repositories/transaction-status.repository.abstract';
import { AbstractAccountRepository } from '../../../account/domain/repositories/account.repository.abstract';
import { AbstractCustomerRepository } from '../../../customer/domain/repositories/customer.repository.abstract';
import { AbstractCurrentUserService } from 'src/shared/application/ports/current-user.service';
import { GetTransactionsInput } from '../dto/input/get-transactions.input.interface';
import { TransactionDomain } from '../../domain/entities/transaction.entity';
import { TransactionOutput } from '../dto/output/transaction.output.dto';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: AbstractTransactionRepository,
    private readonly typeRepository: AbstractTransactionTypeRepository,
    private readonly statusRepository: AbstractTransactionStatusRepository,
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
  ) {}

  async execute(input: GetTransactionsInput): Promise<TransactionOutput[]> {
    const userId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();
    const customer = await this.customerRepository.findByUserId(userId);

    let transactions: TransactionDomain[];

    if (input.accountId) {
      const account = await this.accountRepository.findById(input.accountId);
      if (!account) throw new NotFoundException('Account not found');
      if (currentUserRole !== 'ADMIN' && currentUserRole !== 'WORKER') {
        if (!customer) throw new ForbiddenException('Customer profile not found');
        if (account.customerId !== customer.id) {
          throw new ForbiddenException('Access denied to this account');
        }
      }
      transactions = await this.transactionRepository.findByAccountId(account.id);
    } else {
      if (!customer && currentUserRole !== 'ADMIN' && currentUserRole !== 'WORKER') {
        throw new ForbiddenException('Customer profile not found');
      }
      if (currentUserRole === 'ADMIN' || currentUserRole === 'WORKER') {
        transactions = await this.transactionRepository.findAll();
      } else {
        const accounts = await this.accountRepository.findByCustomerId(customer!.id);
        const accountIds = accounts.map(acc => acc.id);
        if (accountIds.length === 0) {
          transactions = [];
        } else {
          transactions = await this.transactionRepository.findByAccountIds(accountIds);
        }
      }
    }

    let filtered = transactions;
    if (input.fromDate) {
      filtered = filtered.filter(tx => tx.createdAt >= input.fromDate!);
    }
    if (input.toDate) {
      filtered = filtered.filter(tx => tx.createdAt <= input.toDate!);
    }
    if (input.typeCode) {
      filtered = filtered.filter(tx => tx.typeCode === input.typeCode);
    }
    if (input.statusCode) {
      filtered = filtered.filter(tx => tx.statusCode === input.statusCode);
    }

    const result: TransactionOutput[] = [];
    for (const tx of filtered) {
      const type = await this.typeRepository.findByCode(tx.typeCode);
      const status = await this.statusRepository.findByCode(tx.statusCode);
      result.push({
        id: tx.id,
        publicId: tx.publicId,
        fromAccountId: tx.fromAccountId,
        toAccountId: tx.toAccountId,
        amount: tx.amount,
        typeCode: tx.typeCode,
        typeName: type?.name || '',
        statusCode: tx.statusCode,
        statusName: status?.name || '',
        description: tx.description,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      });
    }

    return result;
  }
}