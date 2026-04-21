import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { CustomerOutput } from "../dto/output/create-customer.output.dto";
import { AbstractCurrentUserService } from "../../../../shared/application/ports/current-user.service";
import { AbstractLogger } from "src/shared/application/ports/logger.abstract"; 

@Injectable()
export class GetCustomerUseCase {
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly logger: AbstractLogger, 
  ) {}

  async execute(customerId?: string): Promise<CustomerOutput> {
    const currentUserId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();

    let customer;
    if (customerId) {
      customer = await this.customerRepository.findById(customerId);
      
      if (!customer) {
        await this.logger.warn('Get customer failed: not found', 'customer', currentUserId, { customerId });
        throw new NotFoundException('Customer not found');
      }
      if (currentUserRole !== 'ADMIN' && currentUserRole !== 'WORKER' && customer.userId !== currentUserId) {
        await this.logger.warn('Get customer failed: access denied', 'customer', currentUserId, { customerId });
        throw new ForbiddenException('Access denied');
      }
    } else {
      customer = await this.customerRepository.findByUserId(currentUserId);
      if (!customer) {
        await this.logger.warn('Get customer failed: profile not found', 'customer', currentUserId);
        throw new NotFoundException('Customer profile not found');
      }
    }

    await this.logger.info('Customer profile retrieved', 'customer', currentUserId, { 
      retrievedCustomerId: customer.id 
    });

    return this.toOutput(customer);
  }

  private toOutput(customer): CustomerOutput {
    return {
      id: customer.id,
      userId: customer.userId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      middleName: customer.middleName,
      phoneNumber: customer.phoneNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
