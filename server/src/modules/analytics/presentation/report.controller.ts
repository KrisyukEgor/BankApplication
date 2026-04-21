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

  
}
