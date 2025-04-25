import { MongoConnectionModule, JWTModuleGlobal } from '@app/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { ProviderModule } from './provider/provider.module';
import { ProgramModule } from './program/program.module';
import { TagsModule } from './tags/tags.module';
import { QueueModule } from './queue/queue.module';
import { ProgramurlModule } from './programurl/programurl.module';
import { ScriptLogsModule } from './script-logs/script-logs.module';
import { WebscrapingModule } from './webscraping/webscraping.module';
import { UrlModule } from './url/url.module';
import { DatabaseModule } from '@app/common/infra/mongoose/database.module';
import { WebsiteStructureModule } from './website_structure/website_structure.module';
import { ProgramScrapModule } from './program-scrap/program-scrap.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JWTModuleGlobal,
    UserModule,
    SocketModule,
    ProviderModule,
    ProgramModule,
    TagsModule,
    QueueModule,
    ProgramurlModule,
    ScriptLogsModule,
    WebscrapingModule,
    UrlModule,
    WebsiteStructureModule,
    ProgramScrapModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
