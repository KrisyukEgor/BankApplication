import { Parser } from 'json2csv';
import { Controller, Get, Query, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ROLES_ENUM } from 'src/modules/auth/domain/entities/role.entity';
import { Roles } from 'src/shared/presentation/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/presentation/guards/roles.guard';
import { ReportService } from '../application/report.service';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES_ENUM.ADMIN)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('activity')
  @ApiOperation({ summary: 'User activity statistics by day/week/month' })
  async getUserActivity(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.reportService.getUserActivityStats(period);
  }

  @Get('top-active')
  @ApiOperation({ summary: 'Top active users' })
  async getTopActiveUsers(@Query('limit') limit: number = 10) {
    return this.reportService.getTopActiveUsers(Number(limit));
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Operation distribution (CRUD-like)' })
  async getOperationDistribution() {
    return this.reportService.getOperationDistribution();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Time series trends for last N days' })
  async getTimeTrends(@Query('days') days: number = 7) {
    return this.reportService.getTimeTrends(Number(days));
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Detect anomalies in user behavior' })
  async getAnomalies() {
    return this.reportService.getAnomalies();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export any report to JSON or CSV' })
  @ApiQuery({ name: 'type', enum: ['activity', 'top-active', 'distribution', 'trends', 'anomalies'] })
  @ApiQuery({ name: 'format', enum: ['json', 'csv'], required: false })
  async exportReport(
    @Query('type') type: 'activity' | 'top-active' | 'distribution' | 'trends' | 'anomalies',
    @Query('format') format: 'json' | 'csv' = 'json',
    @Query('period') period?: 'day' | 'week' | 'month',
    @Query('limit') limit?: number,
    @Query('days') days?: number,
    @Res() res?: Response, 
  ) {
    let data: any[];

    switch (type) {
      case 'activity':
        data = await this.reportService.getUserActivityStats(period || 'day');
        break;
      case 'top-active':
        data = await this.reportService.getTopActiveUsers(Number(limit) || 10);
        break;
      case 'distribution':
        data = await this.reportService.getOperationDistribution();
        break;
      case 'trends':
        data = await this.reportService.getTimeTrends(Number(days) || 7);
        break;
      case 'anomalies':
        data = await this.reportService.getAnomalies();
        break;
      default:
        throw new BadRequestException('Invalid report type');
    }

    if (format === 'csv' && res) {
      try {
        const parser = new Parser();
        const csv = parser.parse(data);
        
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`report_${type}_${Date.now()}.csv`);
        return res.send(csv);
      } catch (err) {
        throw new BadRequestException('Failed to generate CSV file');
      }
    } 
    
    return data; 
  }
}
