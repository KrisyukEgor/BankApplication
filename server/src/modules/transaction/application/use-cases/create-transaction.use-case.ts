
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TransactionDomain } from '../../domain/entities/transaction.entity';
import { AbstractTransactionStatusRepository } from '../../domain/repositories/transaction-status.repository.abstract';
import { AbstractTransactionTypeRepository } from '../../domain/repositories/transaction-type.repository.abstract';
import { AbstractTransactionRepository } from '../../domain/repositories/transaction.repository.abstract';
import { CreateTransactionInput } from '../dto/input/create-transaction.input.interface';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: AbstractTransactionRepository,
    private readonly typeRepository: AbstractTransactionTypeRepository,
    private readonly statusRepository: AbstractTransactionStatusRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<TransactionDomain> {
    const type = await this.typeRepository.findByCode(input.typeCode);
    if (!type) throw new Error('Invalid transaction type');

    const status = await this.statusRepository.findByCode('PENDING');
    if (!status) throw new Error('Status PENDING not found');

    const transaction = new TransactionDomain({
      id: undefined as any,
      publicId: uuidv4(),
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      amount: input.amount,
      typeId: type.id,
      statusId: status.id,
      description: input.description,
    });

    return this.transactionRepository.save(transaction);
  }
}