import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from 'src/schemas/program.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { AuthService } from '../services/auth/auth.service';

import {
  Temporaryprogram,
  TemporaryprogramSchema,
} from 'src/schemas/temporaryprogram.schema';
import { Webscraping, WebscrapingSchema } from 'src/schemas/webscraping.schema';
import { Tags, TagsSchema } from 'src/schemas/tags.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Program.name, schema: ProgramSchema },
        { name: Temporaryprogram.name, schema: TemporaryprogramSchema },
        { name: User.name, schema: UserSchema },
       
        { name: Webscraping.name, schema: WebscrapingSchema },
        { name: Tags.name, schema: TagsSchema },
      ],
      DATABASE_CONNECTION.WONDRFLY,
    ),
  ],
  controllers: [ProgramController],
  providers: [ProgramService, AuthService],
})
export class ProgramModule {}
