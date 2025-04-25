import { MailService } from '../services/mail/mail.service';
import { MailModule } from '../services/mail/mail.module';
import { AuthService } from '../services/auth/auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { Child, ChildSchema } from 'src/schemas/child.schema';
import { Program, ProgramSchema } from 'src/schemas/program.schema';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Provider.name, schema: ProviderSchema },
        
        { name: Child.name, schema: ChildSchema },
        { name: Program.name, schema: ProgramSchema },
        
      ],
      DATABASE_CONNECTION.WONDRFLY,
    ),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, MailService],
})
export class UserModule {}
