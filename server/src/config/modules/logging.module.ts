import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntryDocument, LogEntrySchema } from 'src/shared/infrastructure/logging/log-entry.schema';
import { MongoDbLogger } from 'src/shared/infrastructure/logging/mongodb-logger.impl';
import { AbstractLogger } from 'src/shared/application/ports/logger.abstract'; 

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: LogEntryDocument.name, schema: LogEntrySchema }])],
  providers: [{ provide: AbstractLogger, useClass: MongoDbLogger }],
  exports: [AbstractLogger],
})
export class LoggingModule {}