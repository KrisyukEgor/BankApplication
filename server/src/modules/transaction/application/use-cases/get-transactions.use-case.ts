import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { AbstractAccountRepository } from "src/modules/account/domain/repositories/account.repository.abstract";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { TransactionDomain } from "../../domain/entities/transaction.entity";
import { AbstractTransactionStatusRepository } from "../../domain/repositories/transaction-status.repository.abstract";
import { AbstractTransactionTypeRepository } from "../../domain/repositories/transaction-type.repository.abstract";
import { AbstractTransactionRepository } from "../../domain/repositories/transaction.repository.abstract";
import { GetTransactionsInput } from "../dto/input/get-transactions.input.interface";
import { TransactionOutput } from "../dto/output/transaction.output.dto";


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
    if (!customer && currentUserRole !== 'ADMIN') throw new ForbiddenException('Access denied');

    let transactions: TransactionDomain[];
    if (input.accountId) {
      const account = await this.accountRepository.findById(input.accountId);
      if (!account) throw new NotFoundException('Account not found');
      if (currentUserRole !== 'ADMIN' && customer && account.customerId !== customer.id) {
        throw new ForbiddenException('Not your account');
      }
      transactions = await this.transactionRepository.findByAccountId(input.accountId, input.limit, input.offset);
    } else if (input.customerId && (currentUserRole === 'ADMIN' || currentUserRole === 'WORKER')) {
      transactions = await this.transactionRepository.findByCustomerId(input.customerId, input.limit, input.offset);
    } else {
      if (!customer) throw new ForbiddenException('Customer not found');
      transactions = await this.transactionRepository.findByCustomerId(customer.id, input.limit, input.offset);
    }

    const result: TransactionOutput[] = [];
    for (const tx of transactions) {
      const type = await this.typeRepository.findById(tx.typeId);
      const status = await this.statusRepository.findById(tx.statusId);
      result.push({
        id: tx.id,
        publicId: tx.publicId,
        fromAccountId: tx.fromAccountId,
        toAccountId: tx.toAccountId,
        amount: tx.amount,
        typeCode: type?.code || '',
        typeName: type?.name || '',
        statusCode: status?.code || '',
        statusName: status?.name || '',
        description: tx.description,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      });
    }
    return result;
  }
}