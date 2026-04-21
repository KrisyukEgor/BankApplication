import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TransactionDomain } from '../../domain/entities/transaction.entity';
import { AbstractTransactionStatusRepository } from '../../domain/repositories/transaction-status.repository.abstract';
import { AbstractTransactionTypeRepository } from '../../domain/repositories/transaction-type.repository.abstract';
import { AbstractTransactionRepository } from '../../domain/repositories/transaction.repository.abstract';
import { CreateTransactionInput } from '../dto/input/create-transaction.input.interface';
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: AbstractTransactionRepository,
    private readonly typeRepository: AbstractTransactionTypeRepository,
    private readonly statusRepository: AbstractTransactionStatusRepository,
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(input: CreateTransactionInput): Promise<TransactionDomain> {
    const type = await this.typeRepository.findByCode(input.typeCode);
    if (!type) {
      await this.logger.warn('Transaction creation failed: invalid type', 'transaction', undefined, { typeCode: input.typeCode });
      throw new Error('Invalid transaction type');
    }

    const status = await this.statusRepository.findByCode('PENDING');
    if (!status) {
      await this.logger.error('Critical: PENDING status not found in DB', undefined, 'transaction');
      throw new Error('Status PENDING not found');
    }

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

    const savedTransaction = await this.transactionRepository.save(transaction);

    await this.logger.info('Transaction created with PENDING status', 'transaction', undefined, {
      publicId: savedTransaction.publicId,
      amount: savedTransaction.amount,
      type: input.typeCode
    });

    return savedTransaction;
  }
}
