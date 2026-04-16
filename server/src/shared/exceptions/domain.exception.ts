export abstract class DomainException extends Error {
  protected constructor(
    message: string, 
    public readonly httpStatus: number 
  ) {
    super(message);
  }
}
