import { CacheModule } from 'src/cache/cache.module';
import { SocketGateway } from './socket.gateway';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
@Module({
  imports: [
    CacheModule,
    MongooseModule.forFeature([
      // { name: FenceArea.name, schema: FenceAreaSchema },
      // { name: Ride.name, schema: RideSchema },
    ], DATABASE_CONNECTION.WONDRFLY),
  ],
  providers: [SocketGateway],
})
export class SocketModule {}
