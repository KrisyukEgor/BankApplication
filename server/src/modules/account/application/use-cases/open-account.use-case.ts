import { Injectable, ForbiddenException, BadRequestException } from "@nestjs/common";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AccountType } from "../../domain/entities/account-type.entity";
import { Account } from "../../domain/entities/account.entity";
import { AbstractAccountTypeRepository } from "../../domain/repositories/account-type.repository.abstract";
import { AbstractAccountRepository } from "../../domain/repositories/account.repository.abstract";
import { CreateAccountInput } from "../dto/input/create-account.input.dto";
import { AccountOutput } from "../dto/output/account.output.dto";


@Injectable()
export class OpenAccountUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly accountTypeRepository: AbstractAccountTypeRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
  ) {}

  async execute(input: CreateAccountInput): Promise<AccountOutput> {
    const userId = this.currentUser.getUserId();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer) throw new ForbiddenException('Customer profile not found');

    const accountType = await this.accountTypeRepository.findByCode(input.typeCode);
    if (!accountType) throw new BadRequestException('Invalid account type');

    const accountNumber = this.generateAccountNumber();

    const account = new Account({
      id: undefined as any,
      customerId: customer.id,
      number: accountNumber,
      balance: 0,
      typeId: accountType.id,
    });

    const saved = await this.accountRepository.save(account);
    return this.toOutput(saved, accountType);
  }

  private generateAccountNumber(): string {
    return `ACC${Date.now()}${Math.floor(Math.random() * 10000)}`;
  }

  private toOutput(account: Account, type: AccountType): AccountOutput {
    return {
      id: account.id,
      customerId: account.customerId,
      number: account.number,
      balance: account.balance,
      typeCode: type.code,
      typeName: type.name,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}