import { DomainException } from "./domain.exception";

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictException';
  }
}