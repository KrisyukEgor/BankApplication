import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 5432), 
        username: config.get<string>('DB_USERNAME'), 
        password: config.get<string>('DB_PASSWORD'), 
        database: config.get<string>('DB_NAME'),
        
        entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'], 
        
        autoLoadEntities: true,
        synchronize: true, 
        logging: false,
        
        ssl: false, 
      }),
    }),
  ],
  exports: [TypeOrmModule], 
})
export class TypeOrmDbModule {}
