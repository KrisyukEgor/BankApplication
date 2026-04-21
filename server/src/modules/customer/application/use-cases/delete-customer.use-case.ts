import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "../../../../shared/application/ports/current-user.service";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract";


@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly logger: AbstractLogger,
  ) {}

  async execute(customerId?: string): Promise<void> {
    const currentUserId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();

    let customer;

    if (customerId && currentUserRole === 'ADMIN') {
      customer = await this.customerRepository.findById(customerId);
    } 
    else {
      customer = await this.customerRepository.findByUserId(currentUserId);
    }
    if (!customer) {
      await this.logger.warn('Customer deletion failed: profile not found', 'customer', currentUserId, { customerId });
      throw new NotFoundException('Customer profile not found');
    }

    if (currentUserRole !== 'ADMIN' && customer.userId !== currentUserId) {
      await this.logger.warn('Customer deletion failed: access denied', 'customer', currentUserId, { customerId: customer.id });
      throw new ForbiddenException('Access denied');
    }

    await this.logger.info('Customer deleted successfully', 'customer', currentUserId, { 
      deletedCustomerId: customer.id,
      deletedByRole: currentUserRole 
    });

    await this.customerRepository.delete(customer.id);
  }
}