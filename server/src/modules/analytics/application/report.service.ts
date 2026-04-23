import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogLevel } from 'src/shared/application/log-entry.interface';
import { LogEntryDocument } from 'src/shared/infrastructure/logging/log-entry.schema';
import { AbstractCacheService } from 'src/shared/application/ports/cache.service.abstract';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(LogEntryDocument.name) private logModel: Model<LogEntryDocument>,
    private readonly cacheService: AbstractCacheService, 
  ) {}

  private async withCache<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
    const cached = await this.cacheService.get<T>(key);
    if (cached) return cached;

    const result = await fn();
    if (result) {
      await this.cacheService.set(key, result, { ttl });
    }
    return result;
  }

  async getUserActivityStats(period: 'day' | 'week' | 'month'): Promise<any> {
    const cacheKey = `reports:activity:${period}`;
    return this.withCache(cacheKey, 3600, async () => {
      const dateLimit = new Date();
      if (period === 'day') dateLimit.setDate(dateLimit.getDate() - 30);
      if (period === 'week') dateLimit.setMonth(dateLimit.getMonth() - 6);
      if (period === 'month') dateLimit.setFullYear(dateLimit.getFullYear() - 1);

      const groupBy: Record<string, any> = {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: 'Europe/Minsk' } },
        week: { 
          $concat: [
            { $dateToString: { format: '%Y-W', date: '$timestamp', timezone: 'Europe/Minsk' } },
            { $toString: { $isoWeek: '$timestamp' } }
          ]
        },
        month: { $dateToString: { format: '%Y-%m', date: '$timestamp', timezone: 'Europe/Minsk' } },
      };

      const groupId = groupBy[period];
      if (!groupId) throw new BadRequestException(`Invalid period: ${period}`);

      return this.logModel.aggregate([
        { $match: { timestamp: { $gte: dateLimit } } },
        { $group: { _id: groupId, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { period: '$_id', count: 1, _id: 0 } }
      ]).exec();
    });
  }

  async getTopActiveUsers(limit: number = 10): Promise<any> {
    const cacheKey = `reports:top-active:${limit}`;
    return this.withCache(cacheKey, 1800, async () => { 
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 30);

      return this.logModel.aggregate([
        { $match: { userId: { $exists: true, $nin: [null, 'system'] }, timestamp: { $gte: dateLimit } } },
        { $group: { _id: '$userId', actions: { $sum: 1 }, lastSeen: { $max: '$timestamp' }, email: { $max: '$metadata.email' } } },
        { $sort: { actions: -1 } },
        { $limit: limit },
        { $project: { userId: '$_id', actions: 1, lastSeen: 1, email: 1, _id: 0 } },
      ]).exec();
    });
  }

  async getOperationDistribution(): Promise<any> {
    const cacheKey = `reports:distribution`;
    return this.withCache(cacheKey, 3600, async () => {
      return this.logModel.aggregate([
        { $match: { context: { $in: ['customer', 'account', 'deposit', 'transfer', 'withdraw', 'account-management', 'transaction-list'] } } },
        {
          $addFields: {
            crudType: {
              $switch: {
                branches: [
                  { case: { $in: ['$context', ['deposit', 'transfer', 'withdraw']] }, then: 'CREATE' },
                  { case: { $in: ['$context', ['transaction-list']] }, then: 'READ' },
                  { case: { $in: ['$context', ['account-management', 'account', 'customer']] }, then: 'UPDATE' }
                ],
                default: 'OTHER'
              }
            }
          }
        },
        { $group: { _id: '$crudType', count: { $sum: 1 } } },
        { $project: { operation: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]).exec();
    });
  }

  async getTimeTrends(days: number = 7): Promise<any> {
    const cacheKey = `reports:trends:${days}`;
    return this.withCache(cacheKey, 1200, async () => {
      const tz = 'Europe/Minsk';
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      return this.logModel.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp', timezone: tz } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { time: '$_id', count: 1, _id: 0 } },
      ]).exec();
    });
  }

  async getAnomalies(errorThreshold: number = 5): Promise<any> {
    const cacheKey = `reports:anomalies:${errorThreshold}`;
    return this.withCache(cacheKey, 300, async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      return this.logModel.aggregate([
        { $match: { level: LogLevel.ERROR, timestamp: { $gte: oneHourAgo }, userId: { $exists: true, $nin: [null, 'system'] } } },
        { $group: { _id: '$userId', errorCount: { $sum: 1 }, email: { $max: '$metadata.email' } } },
        { $match: { errorCount: { $gt: errorThreshold } } },
        { $sort: { errorCount: -1 } },
        { $project: { userId: '$_id', errorCount: 1, email: 1, _id: 0 } },
      ]).exec();
    });
  }
}
