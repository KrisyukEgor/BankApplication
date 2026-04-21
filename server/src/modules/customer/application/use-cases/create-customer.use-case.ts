import { Injectable, ConflictException } from "@nestjs/common";
import { Customer } from "../../domain/entities/customer.entity";
import { AbstractCustomerRepository } from "../../domain/repositories/customer.repository.abstract";
import { CreateCustomerInput } from "../dto/input/create-customer.input.dto";
import { CustomerOutput } from "../dto/output/create-customer.output.dto";
import { AbstractCurrentUserService } from "../../../../shared/application/ports/current-user.service";
import {v4 as uuidv4} from 'uuid'
import { AbstractLogger } from "src/shared/application/ports/logger.abstract";

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private readonly currentUser: AbstractCurrentUserService,
    private readonly logger: AbstractLogger,
  ) {}

  async execute(input: CreateCustomerInput): Promise<CustomerOutput> {
    const userId = this.currentUser.getUserId();

    const existing = await this.customerRepository.findByUserId(userId);
    if (existing) throw new ConflictException('Customer profile already exists');

    const phoneExists = await this.customerRepository.findByPhone(input.phoneNumber);
    if (phoneExists) throw new ConflictException('Phone number already registered');

    const customer = new Customer({
      id: uuidv4(), 
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName || '',
      phoneNumber: input.phoneNumber,
    });

    const saved = await this.customerRepository.save(customer);

    await this.logger.info(
      `Customer profile created for user ${userId}`,
      'customer',
      userId,
      { customerId: saved.id, phone: input.phoneNumber }
    );

    return this.toOutput(saved);
  }

  private toOutput(customer: Customer): CustomerOutput {
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