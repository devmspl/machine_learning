import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONNECTION } from "./database.config";
import {
  MongooseConfigService,
  MongooseWebScrapingConfigService,
} from "./mongoose-config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Database `APP` connection factory provider
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      connectionName: DATABASE_CONNECTION.WONDRFLY,
    }),

    // Database `ADMIN` connection factory provider
    MongooseModule.forRootAsync({
      useClass: MongooseWebScrapingConfigService,
      connectionName: DATABASE_CONNECTION.WEBSCRAPING,
    }),

    // NOTE: Yes, I know code is redundant but this code repetition is just to give you an idea about the concept
  ],

  exports: [MongooseModule],
  providers:[MongooseConfigService]
})
export class DatabaseModule {}
