import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from 'src/schemas/tags.schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
