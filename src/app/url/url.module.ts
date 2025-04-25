import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from 'src/schemas/url.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Webdump, WebdumpSchema } from 'src/schemas/webdump.schema';
import { Queue, QueueSchema } from 'src/schemas/queue.schema';
import { Cleandump, CleandumpSchema } from 'src/schemas/cleandump.schema';
import {
  Dummyprovider,
  DummyproviderSchema,
} from 'src/schemas/dummyprovider.schema';
import { PlacesService } from '../services/mail/placesService';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

import {
  Citymanagement,
  CitymanagementSchema,
} from 'src/schemas/citymanagement.schema';

import { Tags, TagsSchema } from 'src/schemas/tags.schema';

import {
  Takelessionsubject,
  TakelessionsubjectSchema,
} from 'src/schemas/takelessionsubject.schema';
import {
  Takelessioncategory,
  TakelessioncategorySchema,
} from 'src/schemas/takelessioncategory.schema';
import {
  Takelessiondump,
  TakelessiondumpSchema,
} from 'src/schemas/takelessiondump.schema';
import {
  Takelessionprovider,
  TakelessionproviderSchema,
} from 'src/schemas/takelessionprovider.schema';
import { GraphQLService } from './graphql.service';
import {
  Tasklessonreview,
  TasklessonreviewSchema,
} from 'src/schemas/tasklessonreview.schema';
import {
  Takelessonproviderjson,
  TakelessonproviderjsonSchema,
} from 'src/schemas/takelessonproviderjson.schema';
import {
  Subjectprovider,
  SubjectproviderSchema,
} from 'src/schemas/subjectprovider.schema';
import {
  TakelessonsubjectLessonsjson,
  TakelessonsubjectLessonsjsonSchema,
} from 'src/schemas/takelessonsubjectLessonsjson.schema';
import { Eventlink, EventlinkSchema } from 'src/schemas/eventlink.schema';
import { Event, EventSchema } from 'src/schemas/event.schema ';
import { Event_source, Event_sourceSchema } from 'src/schemas/event_source.schema';
import { Allschoolteacherinfojson, AllschoolteacherinfojsonSchema } from 'src/schemas/allschoolteacherinfojson.schema';
import { Allschoolprogramdump, AllschoolprogramdumpSchema } from 'src/schemas/allschoolprogramdump.schema';
import { Allschoolproviderdump, AllschoolproviderdumpSchema } from 'src/schemas/allschoolproviderdump.schema';
import { Schoolproviderreview, SchoolproviderreviewSchema } from 'src/schemas/schoolproviderreview.schema';
import { Schoolproviderintro, SchoolproviderintroSchema } from 'src/schemas/schoolproviderintro.schema';
import { Schoolproviderprogram, SchoolproviderprogramSchema } from 'src/schemas/schoolproviderprogram.schema';
import { Schoolproviderprograminfo, SchoolproviderprograminfoSchema } from 'src/schemas/schoolproviderprograminfo.schema';
import { Dummyprogram, DummyprogramSchema } from 'src/schemas/dummyprogram.schema';
import { Childcare, ChildcareSchema } from 'src/schemas/childcare.schema';
import { ProgramScrapModule } from '../program-scrap/program-scrap.module';
import { AuthService } from '../services/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Url.name, schema: UrlSchema },
        { name: Queue.name, schema: QueueSchema },
        { name: User.name, schema: UserSchema },
        { name: Provider.name, schema: ProviderSchema },
        { name: Citymanagement.name, schema: CitymanagementSchema },
        { name: Tags.name, schema: TagsSchema },
        
        { name: Eventlink.name, schema: EventlinkSchema },
        { name: Event.name, schema: EventSchema },
        { name: Event_source.name, schema: Event_sourceSchema },
        { name: Childcare.name, schema: ChildcareSchema },
      ],
      DATABASE_CONNECTION.WONDRFLY,
    ),
    MongooseModule.forFeature(
      [
        { name: Webdump.name, schema: WebdumpSchema },
        { name: Cleandump.name, schema: CleandumpSchema },
        { name: Dummyprovider.name, schema: DummyproviderSchema },
        { name: Takelessionsubject.name, schema: TakelessionsubjectSchema },
        { name: Takelessioncategory.name, schema: TakelessioncategorySchema },
        { name: Takelessiondump.name, schema: TakelessiondumpSchema },
        { name: Takelessionprovider.name, schema: TakelessionproviderSchema },
        { name: Tasklessonreview.name, schema: TasklessonreviewSchema },
        { name: Takelessonproviderjson.name, schema: TakelessonproviderjsonSchema },
        { name: Subjectprovider.name, schema: SubjectproviderSchema },
        { name: TakelessonsubjectLessonsjson.name, schema: TakelessonsubjectLessonsjsonSchema },
        { name: Allschoolteacherinfojson.name, schema: AllschoolteacherinfojsonSchema },
        { name: Allschoolproviderdump.name, schema: AllschoolproviderdumpSchema },
        { name: Allschoolprogramdump.name, schema: AllschoolprogramdumpSchema },
        { name: Schoolproviderreview.name, schema: SchoolproviderreviewSchema },
        { name: Schoolproviderintro.name, schema: SchoolproviderintroSchema },
        { name: Schoolproviderprogram.name, schema: SchoolproviderprogramSchema },
        { name: Schoolproviderprograminfo.name, schema: SchoolproviderprograminfoSchema },
        { name: Dummyprogram.name, schema: DummyprogramSchema },
      ],
      DATABASE_CONNECTION.WEBSCRAPING,
    ),
    ProgramScrapModule,
  ],
  controllers: [UrlController],
  providers: [
    UrlService,
    PlacesService,
    AuthService,
    GraphQLService,
  ],
  exports: [
    MongooseModule,
  ],
})
export class UrlModule {}
