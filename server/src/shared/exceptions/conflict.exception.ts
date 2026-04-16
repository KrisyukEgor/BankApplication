import { DomainException } from "src/shared/exceptions/domain.exception";

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictException';
  }
}