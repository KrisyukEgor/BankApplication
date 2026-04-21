import { ForbiddenException, Injectable } from "@nestjs/common";
import { AbstractCurrentUserService } from "src/shared/application/ports/current-user.service";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractAccountTypeRepository } from "../../domain/repositories/account-type.repository.abstract";
import { AbstractAccountRepository } from "../../domain/repositories/account.repository.abstract";
import { AccountOutput } from "../dto/output/account.output.dto";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 

@Injectable()
export class GetAccountsUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly accountTypeRepository: AbstractAccountTypeRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(targetCustomerId?: string): Promise<AccountOutput[]> {
    const currentUserId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();

    let customerId: string;
    if (targetCustomerId && (currentUserRole === 'ADMIN' || currentUserRole === 'WORKER')) {
      customerId = targetCustomerId;
    } else {
      const customer = await this.customerRepository.findByUserId(currentUserId);
      if (!customer) {
        await this.logger.warn('Get accounts failed: profile not found', 'account-list', currentUserId);
        throw new ForbiddenException('Customer profile not found');
      }
      customerId = customer.id;
    }

    const accounts = await this.accountRepository.findByCustomerId(customerId);
    
    await this.logger.info('Account list retrieved', 'account-list', currentUserId, {
      requestedForCustomerId: customerId,
      resultCount: accounts.length,
      byRole: currentUserRole
    });

    const result: AccountOutput[] = [];
    for (const acc of accounts) {
      const type = await this.accountTypeRepository.findById(acc.typeId);
      if (type) {
        result.push({
          id: acc.id,
          customerId: acc.customerId,
          number: acc.number,
          balance: acc.balance,
          typeCode: type.code,
          typeName: type.name,
          createdAt: acc.createdAt,
          updatedAt: acc.updatedAt,
        });
      }
    }
    return result;
  }
}
