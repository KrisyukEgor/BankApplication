import { Global, Module } from "@nestjs/common";
import { DatabaseConfig } from "../../services/database.config";

@Global()
@Module({
  imports: [],
  providers: [DatabaseConfig],
  exports: [DatabaseConfig]
})
export class DatabaseModule {}