import { Module } from '@nestjs/common';
import { ScriptLogsController } from './script-logs.controller';
import { ScriptLogsService } from './script-logs.service';
import { ScriptLogs, ScriptLogsSchema } from 'src/schemas/script-logs.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../services/auth/auth.service';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScriptLogs.name, schema: ScriptLogsSchema },
      { name: User.name, schema: UserSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [ScriptLogsController],
  providers: [ScriptLogsService,AuthService]
})
export class ScriptLogsModule {}
