import { Injectable, BadRequestException } from '@nestjs/common';
import { Parser } from 'json2csv';

@Injectable()
export class ExportService {
  
  generateCsv(data: any[], fields: string[]): Buffer {
    try {
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      return Buffer.from(csv, 'utf-8');
    } catch (error) {
      throw new BadRequestException('Failed to generate CSV file');
    }
  }

  generateJson(data: any[]): Buffer {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      return Buffer.from(jsonString, 'utf-8');
    } catch (error) {
      throw new BadRequestException('Failed to generate JSON file');
    }
  }
}
