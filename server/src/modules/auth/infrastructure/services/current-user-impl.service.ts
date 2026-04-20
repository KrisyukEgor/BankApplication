import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AbstractCurrentUserService } from 'src/shared/services/current-user.service';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserServiceImpl implements AbstractCurrentUserService {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  getUserId(): string {
    return this.request?.user?.sub;
  }

  getUserRole(): string {
    return this.request?.user?.role;
  }

  getUserEmail(): string {
    return this.request?.user?.email;
  }
}