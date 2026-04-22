import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ROLES_ENUM } from 'src/modules/auth/domain/entities/role.entity';
import { Roles } from 'src/shared/presentation/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/presentation/guards/roles.guard';
import { LogQueryService } from '../application/log-query.service';
import { LogFilterDto } from './dto/log-filter.dto';


@ApiTags('logs')
@Controller('logs')
@Roles(ROLES_ENUM.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LogController {
  constructor(private readonly logQueryService: LogQueryService) {}

  @Get()
  @ApiOperation({ summary: 'Get logs with filtering (admin only)' })
  async getLogs(@Query() filter: LogFilterDto) {
    return this.logQueryService.findLogs(filter);
  }
}