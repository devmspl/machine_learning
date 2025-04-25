import { Module } from '@nestjs/common';
import { ProgramurlController } from './programurl.controller';
import { ProgramurlService } from './programurl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Programurl, ProgramurlSchema } from 'src/schemas/programurl.schema';
import { ProgramService } from '../program/program.service';
import { Program, ProgramSchema } from 'src/schemas/program.schema';
import { Temporaryprogram, TemporaryprogramSchema } from 'src/schemas/temporaryprogram.schema';
import { Webscraping, WebscrapingSchema } from 'src/schemas/webscraping.schema';
import { Tags, TagsSchema } from 'src/schemas/tags.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Programurl.name, schema: ProgramurlSchema },
      { name: User.name, schema: UserSchema },
      { name: Program.name, schema: ProgramSchema },
      { name: Temporaryprogram.name, schema: TemporaryprogramSchema },
      { name: Webscraping.name, schema: WebscrapingSchema },
      { name: Tags.name, schema: TagsSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [ProgramurlController],
  providers: [ProgramurlService,ProgramService]
})
export class ProgramurlModule { }
