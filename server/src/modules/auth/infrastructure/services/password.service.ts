import { Injectable } from "@nestjs/common";
import { AbstractPasswordService } from "src/modules/auth/application/ports/password.service.abstract";
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordService implements AbstractPasswordService {
  private salt = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}