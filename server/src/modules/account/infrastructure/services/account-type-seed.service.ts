import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeOrmEntity } from '../persistence/orm-entities/account-type.orm-entity';

export enum ACCOUNT_TYPE_ENUM {
  DEPOSIT = 'DEPOSIT',
  CREDIT = 'CREDIT'
}

@Injectable()
export class AccountTypeSeedService implements OnApplicationBootstrap {

  constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly accountTypeRepository: Repository<AccountTypeOrmEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async seed() {
    const types = [
      { 
        code: ACCOUNT_TYPE_ENUM.CREDIT, 
        name: 'Кредитный', 
        description: 'Кредитный счет' 
      },
      { 
        code: ACCOUNT_TYPE_ENUM.DEPOSIT, 
        name: 'Депозитный', 
        description: 'Срочный вклад с ограничениями на снятие' 
      },
    ];

    for (const type of types) {
      const exists = await this.accountTypeRepository.findOneBy({ code: type.code });
      
      if (!exists) {
        const entity = this.accountTypeRepository.create({
          code: type.code,
          name: type.name,
          description: type.description,
        });
        
        await this.accountTypeRepository.save(entity);
      }
    }
  }
}
