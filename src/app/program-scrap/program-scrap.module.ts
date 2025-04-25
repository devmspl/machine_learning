import { Module } from '@nestjs/common';
import { ProgramScrapController } from './program-scrap.controller';
import { ProgramScrapService } from './program-scrap.service';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Allschoolprogramdump, AllschoolprogramdumpSchema } from 'src/schemas/allschoolprogramdump.schema';
import { Allschoolproviderdump, AllschoolproviderdumpSchema } from 'src/schemas/allschoolproviderdump.schema';
import { Allschoolteacherinfojson, AllschoolteacherinfojsonSchema } from 'src/schemas/allschoolteacherinfojson.schema';
import { Citymanagement, CitymanagementSchema } from 'src/schemas/citymanagement.schema';
import { Cleandump, CleandumpSchema } from 'src/schemas/cleandump.schema';
import { Dummyprovider, DummyproviderSchema } from 'src/schemas/dummyprovider.schema';
import { EventSchema } from 'src/schemas/event.schema ';
import { Event_source, Event_sourceSchema } from 'src/schemas/event_source.schema';
import { Eventlink, EventlinkSchema } from 'src/schemas/eventlink.schema';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { Queue, QueueSchema } from 'src/schemas/queue.schema';
import { Schoolproviderintro, SchoolproviderintroSchema } from 'src/schemas/schoolproviderintro.schema';
import { Schoolproviderprogram, SchoolproviderprogramSchema } from 'src/schemas/schoolproviderprogram.schema';
import { Schoolproviderprograminfo, SchoolproviderprograminfoSchema } from 'src/schemas/schoolproviderprograminfo.schema';
import { Schoolproviderreview, SchoolproviderreviewSchema } from 'src/schemas/schoolproviderreview.schema';
import { Subjectprovider, SubjectproviderSchema } from 'src/schemas/subjectprovider.schema';
import { Tags, TagsSchema } from 'src/schemas/tags.schema';
import { Takelessioncategory, TakelessioncategorySchema } from 'src/schemas/takelessioncategory.schema';
import { Takelessiondump, TakelessiondumpSchema } from 'src/schemas/takelessiondump.schema';
import { Takelessionprovider, TakelessionproviderSchema } from 'src/schemas/takelessionprovider.schema';
import { Takelessionsubject, TakelessionsubjectSchema } from 'src/schemas/takelessionsubject.schema';
import { Takelessonproviderjson, TakelessonproviderjsonSchema } from 'src/schemas/takelessonproviderjson.schema';
import { TakelessonsubjectLessonsjson, TakelessonsubjectLessonsjsonSchema } from 'src/schemas/takelessonsubjectLessonsjson.schema';
import { Tasklessonreview, TasklessonreviewSchema } from 'src/schemas/tasklessonreview.schema';
import { Url, UrlSchema } from 'src/schemas/url.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Webdump, WebdumpSchema } from 'src/schemas/webdump.schema';
import { AuthService } from '../services/auth/auth.service';
import { PlacesService } from '../services/mail/placesService';
import { GraphQLService } from '../url/graphql.service';
import { Dummyprogram, DummyprogramSchema } from 'src/schemas/dummyprogram.schema';
import { Program, ProgramSchema } from 'src/schemas/program.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Url.name, schema: UrlSchema },
        { name: Queue.name, schema: QueueSchema },
        { name: User.name, schema: UserSchema },
        { name: Provider.name, schema:ProgramSchema },
        { name: Program.name, schema: ProviderSchema },
        { name: Citymanagement.name, schema: CitymanagementSchema },
        { name: Tags.name, schema: TagsSchema },
        { name: Eventlink.name, schema: EventlinkSchema },
        { name: Event.name, schema: EventSchema },
        { name: Event_source.name, schema: Event_sourceSchema },
        
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
        { name: Dummyprogram.name, schema: DummyprogramSchema }
      ],
      DATABASE_CONNECTION.WEBSCRAPING,
    ),
  ],
  controllers: [ProgramScrapController],
  providers: [
    ProgramScrapService,
    PlacesService,
    AuthService,
    GraphQLService,
  ],
  exports: [ProgramScrapService],
})
export class ProgramScrapModule {}
