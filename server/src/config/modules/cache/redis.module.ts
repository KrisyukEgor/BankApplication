import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { AbstractCacheService } from "src/shared/application/ports/cache.service.abstract";
import { RedisCacheService } from "src/shared/infrastructure/redis-cache.service";

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        })
      },
      inject: [ConfigService]
    },
    {
      provide: AbstractCacheService,
      useClass: RedisCacheService
    }
  ],
  exports: [
    'REDIS_CLIENT',
    AbstractCacheService
  ]
})
export class RedisCacheModule {}