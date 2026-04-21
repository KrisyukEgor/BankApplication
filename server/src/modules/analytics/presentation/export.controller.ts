import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from '../application/export.service';
import { ReportService } from '../application/report.service';

@Controller('export')
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly reportService: ReportService,
  ) {}

  @Get('transactions-trends')
  async exportTrends(
    @Query('format') format: 'json' | 'csv' = 'csv',
    @Query('days') days: number = 7,
    @Res() res: Response,
  ) {
    const rawData = await this.reportService.getTimeTrends(days);

    const fileName = `time_trends_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      const fields = ['time', 'count']; 
      const fileBuffer = this.exportService.generateCsv(rawData, fields);

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}.csv"`,
      });
      
      return res.send(fileBuffer);
    } 

    if (format === 'json') {
      const fileBuffer = this.exportService.generateJson(rawData);

      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}.json"`,
      });

      return res.send(fileBuffer);
    }

    throw new BadRequestException('Unsupported format. Use "csv" or "json"');
  }
}
