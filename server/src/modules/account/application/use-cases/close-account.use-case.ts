import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { AbstractCurrentUserService } from "src/shared/services/current-user.service";
import { AbstractCustomerRepository } from "src/modules/customer/domain/repositories/customer.repository.abstract";
import { AbstractAccountRepository } from "../../domain/repositories/account.repository.abstract";

@Injectable()
export class CloseAccountUseCase {
  constructor(
    private readonly accountRepository: AbstractAccountRepository,
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
  ) {}

  async execute(accountId: string): Promise<void> {
    const userId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();
    const customer = await this.customerRepository.findByUserId(userId);
    if (!customer && currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Customer profile not found');
    }
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new NotFoundException('Account not found');

    if (currentUserRole !== 'ADMIN' && customer && account.customerId !== customer.id) {
      throw new ForbiddenException('You can only close your own accounts');
    }

    if (!account.canBeClosed()) throw new BadRequestException('Cannot close account with non-zero balance');

    await this.accountRepository.delete(account.id);
  }
}