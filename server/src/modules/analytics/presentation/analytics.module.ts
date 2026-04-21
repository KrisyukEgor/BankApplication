import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntryDocument, LogEntrySchema } from 'src/shared/infrastructure/logging/log-entry.schema';
import { ReportService } from '../application/report.service';
import { ReportController } from './report.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ExportController } from './export.controller';
import { ExportService } from '../application/export.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogEntryDocument.name, schema: LogEntrySchema }

    ]),
    AuthModule,
  ],
  controllers: [ReportController, ExportController],
  providers: [ReportService, ExportService],
  exports: [ReportService],
})
export class AnalyticsModule {}