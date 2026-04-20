export abstract class AbstractAccountNumberGenerator {
  abstract generate(): Promise<string>;
}