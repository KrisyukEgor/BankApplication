import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { AbstractCurrentUserService } from "../../../../shared/services/current-user.service";


@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
  ) {}

  async execute(customerId?: string): Promise<void> {
    const currentUserId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();

    let customer;
    if (customerId && currentUserRole === 'ADMIN') {
      customer = await this.customerRepository.findById(customerId);
    } else {
      customer = await this.customerRepository.findByUserId(currentUserId);
    }
    if (!customer) throw new NotFoundException('Customer profile not found');
    if (currentUserRole !== 'ADMIN' && customer.userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    await this.customerRepository.delete(customer.id);
  }
}