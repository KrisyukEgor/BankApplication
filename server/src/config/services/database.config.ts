import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { EnvConfigService } from './env.config';

@Injectable()
export class DatabaseConfig {
  private pool: Pool;

  constructor(
    private readonly config: EnvConfigService 
  ){
    this.pool = new Pool({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      max: 20,
    });

    console.log(`DB connected: ${config.dbHost}:${config.dbPort}/${config.dbName}`);
  }

  getPool(): Pool {
    return this.pool;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

}