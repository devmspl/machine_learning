import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { PlacesService } from './placesService';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            auth: {
              user: config.get<string>('MAIL_EMAIL'),
              pass: config.get<string>('MAIL_PASSWORD'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService,PlacesService],
  exports: [MailService,PlacesService],
})
export class MailModule {}
