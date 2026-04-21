import { FactoryProvider, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './config/modules/app.config.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmDbModule } from './config/modules/db/typeorm.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { RedisCacheModule } from './config/modules/cache/redis.module';
import { LoggingModule } from './config/modules/logging.module';
import { MongoDatabaseModule } from './config/modules/db/mongo.module';
import { AnalyticsModule } from './modules/analytics/presentation/analytics.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    MongoDatabaseModule,
    LoggingModule,
    RedisCacheModule,
    AppConfigModule, 
    TypeOrmDbModule,
    AuthModule, 
    AccountModule, 
    TransactionModule, 
    CustomerModule, 
    AnalyticsModule,
    // LoanModule,
  ],
})
export class AppModule {}