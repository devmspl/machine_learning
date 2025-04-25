import { Module } from '@nestjs/common';
import { WebscrapingController } from './webscraping.controller';
import { WebscrapingService } from './webscraping.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Webscraping, WebscrapingSchema } from 'src/schemas/webscraping.schema';
import { Program, ProgramSchema } from 'src/schemas/program.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Programurl, ProgramurlSchema } from 'src/schemas/programurl.schema';
import { AuthService } from '../services/auth/auth.service';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Webscraping.name, schema: WebscrapingSchema },
      { name: Program.name, schema: ProgramSchema },
      { name: User.name, schema: UserSchema },
      { name: Programurl.name, schema: ProgramurlSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [WebscrapingController],
  providers: [WebscrapingService,AuthService],
})
export class WebscrapingModule {}
