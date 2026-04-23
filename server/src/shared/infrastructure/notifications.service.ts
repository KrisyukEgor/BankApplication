import { Injectable, OnModuleInit } from "@nestjs/common";
import { AbstractCacheService } from "../application/ports/cache.service.abstract";

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly cacheService: AbstractCacheService) {}

  onModuleInit() {
    this.cacheService.subscribe('users_changed', (data) => {
      console.log(`Уведомление: Пользователь ${data.id} был изменен (${data.type})`);
    });

    this.cacheService.subscribe('transactions_changed', (data) => {
      console.log(` Новая транзакция: ${data.id}`);
    });
  }
}