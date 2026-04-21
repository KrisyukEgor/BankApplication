import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntryDocument, LogEntrySchema } from 'src/shared/infrastructure/logging/log-entry.schema';
import { MongoDbLogger } from 'src/shared/infrastructure/logging/mongodb-logger.impl';
import { AbstractLogger } from 'src/shared/application/ports/logger.abstract'; 
import { LogController } from 'src/modules/analytics/presentation/log.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LogQueryService } from 'src/modules/analytics/application/log-query.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: LogEntryDocument.name, schema: LogEntrySchema }]), AuthModule],
  controllers: [LogController],
  providers: [{ provide: AbstractLogger, useClass: MongoDbLogger }, LogQueryService],
  exports: [AbstractLogger],
})
export class LoggingModule {}