import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "./application/use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "./application/use-cases/get-customer.use-case";
import { UpdateCustomerUseCase } from "./application/use-cases/update-customer.use-case";
import { AbstractCustomerRepository } from "./domain/repositories/customer.repository.abstract";
import { CustomerRepository } from "./infrastructure/persistence/customer.repostiory";
import { CustomerOrmEntity } from "./infrastructure/persistence/orm-entities/customer.orm-entity";
import { CustomerController } from "./presentation/controllers/customer.controller";
import { AuthModule } from "../auth/auth.module";


@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity]), AuthModule],
  controllers: [CustomerController],
  providers: [
    { provide: AbstractCustomerRepository, useClass: CustomerRepository },
    CreateCustomerUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [AbstractCustomerRepository],
})
export class CustomerModule {}