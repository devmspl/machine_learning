import { StripeService } from './stripe.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Module({
  providers: [StripeService, ConfigService],
  exports: [StripeService, ConfigService],
})
export class StripeModule {}
