import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TRANSACTION_STATUS_ENUM } from '../../domain/entities/transaction-status.entity';
import { TransactionStatusOrmEntity } from '../persistence/orm-entities/transaction-status.orm-entity';

@Injectable()
export class TransactionStatusSeedService implements OnApplicationBootstrap {

  constructor(
    @InjectRepository(TransactionStatusOrmEntity)
    private readonly transactionStatusRepository: Repository<TransactionStatusOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
  const statuses = [
    { code: TRANSACTION_STATUS_ENUM.PENDING, name: 'В обработке' },
    { code: TRANSACTION_STATUS_ENUM.COMPLETED, name: 'Выполнена' },
    { code: TRANSACTION_STATUS_ENUM.FAILED, name: 'Ошибка' },
    { code: TRANSACTION_STATUS_ENUM.CANCELLED, name: 'Отменена' },
  ];

  for (const status of statuses) {
    const exists = await this.transactionStatusRepository.findOneBy({ code: status.code });
    if (!exists) {
      const entity = this.transactionStatusRepository.create({
        code: status.code,
        name: status.name,
      });
      await this.transactionStatusRepository.save(entity);
    }
  }
}
}