import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppConfigModule } from './config/modules/app.config.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmDbModule } from './config/modules/db/typeorm.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    AppConfigModule, 
    TypeOrmDbModule,
    AuthModule, 
    // AccountModule, 
    // TransactionModule, 
    // CustomerModule, 
    // LoanModule,
  ],
})
export class AppModule {}