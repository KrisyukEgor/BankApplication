import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { UpdateCustomerInput } from "../dto/input/update-customer.input.dto";
import { CustomerOutput } from "../dto/output/create-customer.output.dto";
import { AbstractCurrentUserService } from "../../../../shared/services/current-user.service";

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
  ) {}

  async execute(input: UpdateCustomerInput, targetCustomerId?: string): Promise<CustomerOutput> {
    const currentUserId = this.currentUser.getUserId();
    const currentUserRole = this.currentUser.getUserRole();

    let customer;
    if (targetCustomerId && (currentUserRole === 'ADMIN' || currentUserRole === 'WORKER')) {
      customer = await this.customerRepository.findById(targetCustomerId);
    } else {
      customer = await this.customerRepository.findByUserId(currentUserId);
    }
    if (!customer) throw new NotFoundException('Customer profile not found');
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'WORKER' && customer.userId !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (input.phoneNumber && input.phoneNumber !== customer.phoneNumber) {
      const existing = await this.customerRepository.findByPhone(input.phoneNumber);
      if (existing && existing.id !== customer.id) {
        throw new ConflictException('Phone number already used by another customer');
      }
    }

    customer.updatePersonalInfo({
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName,
      phoneNumber: input.phoneNumber,
    });

    const updated = await this.customerRepository.save(customer);
    return this.toOutput(updated);
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