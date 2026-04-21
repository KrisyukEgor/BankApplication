import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogLevel } from 'src/shared/application/log-entry.interface';
import { LogEntryDocument } from 'src/shared/infrastructure/logging/log-entry.schema';

@Injectable()
export class ReportService {
  constructor(@InjectModel(LogEntryDocument.name) private logModel: Model<LogEntryDocument>) {}

  async getUserActivityStats(period: 'day' | 'week' | 'month'): Promise<any> {
    const groupBy: Record<string, any> = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$timestamp' } }, 
      month: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
    };
    
    const groupId = groupBy[period];
    
    return this.logModel.aggregate([
      { $match: { context: 'auth' } },
      { $group: { _id: groupId, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { period: '$_id', count: 1, _id: 0 } }
    ]);
  }

  async getTopActiveUsers(limit: number = 10): Promise<any> {
    return this.logModel.aggregate([
      { $match: { userId: { $exists: true, $nin: [null, 'system'] } } },
      { 
        $group: { 
          _id: '$userId', 
          actions: { $sum: 1 }, 
          lastSeen: { $max: '$timestamp' },
          email: { $last: '$metadata.email' } 
        } 
      },
      { $sort: { actions: -1 } },
      { $limit: limit },
      { $project: { userId: '$_id', actions: 1, lastSeen: 1, email: 1, _id: 0 } },
    ]);
  }

  // 3. Распределение операций по типам (CRUD-статистика)
  async getOperationDistribution(): Promise<any> {
    return this.logModel.aggregate([
      // Добавили все контексты, которые мы реально используем в Use-Cases
      { 
        $match: { 
          context: { 
            $in: ['customer', 'account', 'deposit', 'transfer', 'withdraw', 'account-management', 'transaction-list'] 
          } 
        } 
      },
      { $group: { _id: { context: '$context', level: '$level' }, count: { $sum: 1 } } },
      { $project: { context: '$_id.context', level: '$_id.level', count: 1, _id: 0 } },
      { $sort: { context: 1, count: -1 } },
    ]);
  }

  // 4. Временные тренды (time series) за последние N дней
  async getTimeTrends(days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.logModel.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            hour: { $hour: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1, '_id.hour': 1 } },
      { $project: { date: '$_id.date', hour: '$_id.hour', count: 1, _id: 0 } },
    ]);
  }

  // 5. Аномалии в поведении пользователей (например, >5 ошибок за час)
  async getAnomalies(): Promise<any> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.logModel.aggregate([
      { 
        $match: { 
          level: LogLevel.ERROR, 
          timestamp: { $gte: oneHourAgo }, 
          userId: { $exists: true, $ne: null } 
        } 
      },
      { 
        $group: { 
          _id: '$userId', 
          errorCount: { $sum: 1 },
          email: { $last: '$metadata.email' } 
        } 
      },
      { $match: { errorCount: { $gt: 5 } } },
      { $sort: { errorCount: -1 } },
      { $project: { userId: '$_id', errorCount: 1, email: 1, _id: 0 } },
    ]);
  }
}
