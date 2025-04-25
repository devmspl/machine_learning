import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({})
export class MongoConnectionModule {
  static register(id: string | number): DynamicModule {
    return {
      module: MongoConnectionModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              uri: configService.get<string>('MONGO_URI' + id),
              retryAttempts: 5,
              retryDelay: 5,
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [MongoConnectionModule],
    };
  }
}
