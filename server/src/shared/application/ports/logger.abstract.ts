import { LogEntry, LogLevel } from "../log-entry.interface";

export abstract class AbstractLogger {
  abstract log(entry: LogEntry): Promise<void>;

  async info(message: string, context?: string, userId?: string, metadata?: any): Promise<void> {
    return this.log({
      timestamp: new Date(),
      level: LogLevel.INFO,
      message,
      context,
      userId,
      metadata,
    });
  }

  async warn(message: string, context?: string, userId?: string, metadata?: any): Promise<void> {
    return this.log({
      timestamp: new Date(),
      level: LogLevel.WARN,
      message,
      context,
      userId,
      metadata,
    });
  }

  async error(message: string, context?: string, userId?: string, metadata?: any): Promise<void> {
    return this.log({
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message,
      context,
      userId,
      metadata,
    });
  }

  async debug(message: string, context?: string, userId?: string, metadata?: any): Promise<void> {
    return this.log({
      timestamp: new Date(),
      level: LogLevel.DEBUG,
      message,
      context,
      userId,
      metadata,
    });
  }
}