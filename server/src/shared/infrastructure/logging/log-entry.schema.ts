import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { LogLevel } from "src/shared/application/log-entry.interface";

@Schema({
  collection: 'logs',
  timestamps: false,
})
export class LogEntryDocument extends Document {
  @Prop({ required: true, default: Date.now, index: true })
  timestamp: Date;

  @Prop({ required: true, enum: Object.values(LogLevel) })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({index: true})
  context: string;

  @Prop({index: true})
  userId: string;

  @Prop({ type: Object })
  metadata: any;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntryDocument);

LogEntrySchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

LogEntrySchema.index({ userId: 1, timestamp: -1 });