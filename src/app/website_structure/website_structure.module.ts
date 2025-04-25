import { Module } from '@nestjs/common';
import { WebsiteStructureController } from './website_structure.controller';
import { WebsiteStructureService } from './website_structure.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Website_structure, Website_structureSchema } from 'src/schemas/website_structure.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Event_source, Event_sourceSchema } from 'src/schemas/event_source.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Website_structure.name, schema: Website_structureSchema },
      { name: Event_source.name, schema: Event_sourceSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [WebsiteStructureController],
  providers: [WebsiteStructureService]
})
export class WebsiteStructureModule {}
