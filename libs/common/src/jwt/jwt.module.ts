import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },  // new add code
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JWTModuleGlobal {}
