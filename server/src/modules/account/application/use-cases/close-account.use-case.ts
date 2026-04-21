import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractCurrentUserService } from "src/shared/application/ports/current-user.service";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractAccountRepository } from "../../domain/repositories/account.repository.abstract";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 

@Injectable()
export class CloseAccountUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(accountId: string): Promise<void> {
    const userId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();
    const customer = await this.customerRepository.findByUserId(userId);
    
    if (!customer && currentUserRole !== 'ADMIN') {
      await this.logger.warn('Close account failed: profile not found', 'account-management', userId);
      throw new ForbiddenException('Customer profile not found');
    }
    
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      await this.logger.warn('Close account failed: account not found', 'account-management', userId, { accountId });
      throw new NotFoundException('Account not found');
    }

    if (currentUserRole !== 'ADMIN' && customer && account.customerId !== customer.id) {
      await this.logger.warn('Close account failed: access denied', 'account-management', userId, { accountId: account.id });
      throw new ForbiddenException('You can only close your own accounts');
    }

    if (!account.canBeClosed()) {
      await this.logger.warn('Close account failed: non-zero balance', 'account-management', userId, { 
        accountId: account.id, 
        currentBalance: account.balance 
      });
      throw new BadRequestException('Cannot close account with non-zero balance');
    }

    await this.accountRepository.delete(account.id);

    await this.logger.info('Account closed successfully', 'account-management', userId, { 
      closedAccountId: account.id,
      byRole: currentUserRole 
    });
  }
}
