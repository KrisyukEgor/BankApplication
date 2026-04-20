import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRANSACTION_TYPE_ENUM } from '../../domain/entities/transaction-type.entity';
import { TransactionTypeOrmEntity } from '../persistence/orm-entities/transaction-type.orm-entity';

@Injectable()
export class TransactionTypeSeedService implements OnApplicationBootstrap {

  constructor(
    @InjectRepository(TransactionTypeOrmEntity)
    private readonly transactionTypeRepository: Repository<TransactionTypeOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
    const types = [
      { code: TRANSACTION_TYPE_ENUM.DEPOSIT, name: 'Пополнение', description: 'Пополнение счёта' },
      { code: TRANSACTION_TYPE_ENUM.WITHDRAW, name: 'Снятие', description: 'Снятие наличных' },
      { code: TRANSACTION_TYPE_ENUM.TRANSFER, name: 'Перевод', description: 'Перевод между счетами' },
      { code: TRANSACTION_TYPE_ENUM.LOAN_PAYMENT, name: 'Платёж по кредиту', description: 'Погашение кредита' },
    ];

    for (const type of types) {
      const exists = await this.transactionTypeRepository.findOneBy({ code: type.code });
      if (!exists) {
        const entity = this.transactionTypeRepository.create({
          code: type.code,
          name: type.name,
          description: type.description,
        });
        await this.transactionTypeRepository.save(entity);
      }
    }
  }
}