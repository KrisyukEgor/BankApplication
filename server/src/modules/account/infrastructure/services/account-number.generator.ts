import { Injectable } from "@nestjs/common";
import { AbstractAccountNumberGenerator } from "../../application/services/account-number.generator.abstract";


@Injectable()
export class SimpleAccountNumberGenerator extends AbstractAccountNumberGenerator {
  private readonly PREFIX = 'ACC';
  private readonly BANK_CODE = '4100';
  private readonly ACCOUNT_LENGTH = 20;

  async generate(): Promise<string> {
    const datePart = this.getDatePart();
    const randomPart = this.getRandomPart();
    
    return `${this.PREFIX}-${this.BANK_CODE}-${datePart}-${randomPart}`;
  }

  private getDatePart(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
  }

  private getRandomPart(): string {
    const random = Math.floor(Math.random() * 1000000);
    const padded = String(random).padStart(6, '0');
    const checkDigit = this.calculateCheckDigit(padded);
    
    return `${padded}${checkDigit}`;
  }

  private calculateCheckDigit(number: string): string {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      sum += parseInt(number[i], 10) * (i + 1);
    }
    return String(sum % 10);
  }
}