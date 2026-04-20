import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "../account/account.module";
import { AuthModule } from "../auth/auth.module";
import { CustomerModule } from "../customer/customer.module";
import { CreateTransactionUseCase } from "./application/use-cases/create-transaction.use-case";
import { DepositUseCase } from "./application/use-cases/deposit.use-case";
import { GetTransactionsUseCase } from "./application/use-cases/get-transactions.use-case";
import { TransferUseCase } from "./application/use-cases/transfer.use-case";
import { AbstractTransactionStatusRepository } from "./domain/repositories/transaction-status.repository.abstract";
import { AbstractTransactionTypeRepository } from "./domain/repositories/transaction-type.repository.abstract";
import { AbstractTransactionRepository } from "./domain/repositories/transaction.repository.abstract";
import { TransactionStatusOrmEntity } from "./infrastructure/persistence/orm-entities/transaction-status.orm-entity";
import { TransactionTypeOrmEntity } from "./infrastructure/persistence/orm-entities/transaction-type.orm-entity";
import { TransactionOrmEntity } from "./infrastructure/persistence/orm-entities/transaction.orm-entity";
import { TransactionController } from "./presentation/controller/transaction.controller";
import { Module } from "@nestjs/common";
import { TransactionRepository } from "./infrastructure/persistence/repositories/transaction.repository.impl";
import { TransactionStatusRepository } from "./infrastructure/persistence/repositories/transaction-status.repository.impl";
import { WithdrawUseCase } from "./application/use-cases/withdraw.use-case";
import { TransactionTypeRepository } from "./infrastructure/persistence/repositories/transaction-type.repository.impl";
import { TransactionTypeSeedService } from "./infrastructure/services/transaction-type-seed.service";
import { TransactionStatusSeedService } from "./infrastructure/services/transaction-status-seed.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity, TransactionTypeOrmEntity, TransactionStatusOrmEntity]),
    AccountModule,
    CustomerModule,
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionTypeSeedService,
    TransactionStatusSeedService,
    { provide: AbstractTransactionRepository, useClass: TransactionRepository },
    { provide: AbstractTransactionTypeRepository, useClass: TransactionTypeRepository },
    { provide: AbstractTransactionStatusRepository, useClass: TransactionStatusRepository },
    CreateTransactionUseCase,
    DepositUseCase,
    WithdrawUseCase,
    TransferUseCase,
    GetTransactionsUseCase,
  ],
  exports: [AbstractTransactionRepository],
})
export class TransactionModule {}