import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogEntry } from 'src/shared/application/log-entry.interface';
import { LogEntryDocument } from 'src/shared/infrastructure/logging/log-entry.schema';
import { LogFilterDto } from '../presentation/dto/log-filter.dto';

@Injectable()
export class LogQueryService {
  constructor(@InjectModel(LogEntryDocument.name) private logModel: Model<LogEntryDocument>) {}

  async findLogs(filter: LogFilterDto): Promise<{ items: LogEntry[]; total: number }> {
    const query: any = {};

    if (filter.fromDate || filter.toDate) {
      query.timestamp = {};
      if (filter.fromDate) query.timestamp.$gte = new Date(filter.fromDate);
      if (filter.toDate) query.timestamp.$lte = new Date(filter.toDate);
    }

    if (filter.userId) query.userId = filter.userId;

    if (filter.context) query.context = filter.context;

    if (filter.level) query.level = filter.level;

    const docs = await this.logModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(filter.limit ?? 100)
      .skip(filter.offset ?? 0)
      .lean()
      .exec();

    const items: LogEntry[] = docs.map(doc => ({
      timestamp: doc.timestamp,
      level: doc.level as any, 
      message: doc.message,
      context: doc.context,
      userId: doc.userId,
      metadata: doc.metadata,
    }));

    const total = await this.logModel.countDocuments(query);
    return { items, total };
  }
}