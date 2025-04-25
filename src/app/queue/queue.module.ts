import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from 'src/schemas/queue.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from '../services/auth/auth.service';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Queue.name, schema: QueueSchema },
      { name: User.name, schema: UserSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  controllers: [QueueController],
  providers: [QueueService, AuthService],
})
export class QueueModule {}
