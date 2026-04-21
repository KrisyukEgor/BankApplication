import { AbstractLogger } from "src/shared/application/ports/logger.abstract";
import { LogEntryDocument } from "./log-entry.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LogEntry } from "src/shared/application/log-entry.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MongoDbLogger extends AbstractLogger {
  constructor(@InjectModel(LogEntryDocument.name) private logModel: Model<LogEntryDocument>) {
    super();
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      const logDoc = new this.logModel({
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
        context: entry.context,
        userId: entry.userId,
        metadata: entry.metadata,
      });

      await logDoc.save();
    }
    catch (err) {
      console.error('[MongoDBLogger] Failed to save log:', err);
      console.error(entry);
    }
  }
}