import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CustomerModule } from "../customer/customer.module";
import { CloseAccountUseCase } from "./application/use-cases/close-account.use-case";
import { GetAccountsUseCase } from "./application/use-cases/get-accounts.use-case";
import { OpenAccountUseCase } from "./application/use-cases/open-account.use-case";
import { AbstractAccountTypeRepository } from "./domain/repositories/account-type.repository.abstract";
import { AbstractAccountRepository } from "./domain/repositories/account.repository.abstract";
import { AccountTypeOrmEntity } from "./infrastructure/persistence/orm-entities/account-type.orm-entity";
import { AccountOrmEntity } from "./infrastructure/persistence/orm-entities/account.orm-entity";
import { AccountController } from "./presentation/controllers/account.controller";
import { Module } from "@nestjs/common";
import { AccountTypeRepository } from "./infrastructure/persistence/repositories/account-type.repository.impl";
import { AccountRepository } from "./infrastructure/persistence/repositories/account.repository.impl";


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountOrmEntity, AccountTypeOrmEntity]),
    CustomerModule,  
    AuthModule,      
  ],
  controllers: [AccountController],
  providers: [
    { provide: AbstractAccountRepository, useClass: AccountRepository },
    { provide: AbstractAccountTypeRepository, useClass: AccountTypeRepository },
    OpenAccountUseCase,
    GetAccountsUseCase,
    CloseAccountUseCase,
  ],
  exports: [AbstractAccountRepository],
})
export class AccountModule {}