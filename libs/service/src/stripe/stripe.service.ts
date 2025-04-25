import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IcardTokenOptions, ICreatePaymentIntent } from './stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const SK_KEY =
      this.configService.get<string>('STRIPE_TEST_SK_KEY') ??
      this.configService.get<string>('STRIPE_SK_KEY');
    this.stripe = new Stripe(SK_KEY, {
      apiVersion: '2023-08-16',
    });
  }
  async create_card_token(model: IcardTokenOptions) {
    try {
      const { number, exp_month, exp_year, cvc } = model;
      const token = await this.stripe.tokens.create({
        card: { number, exp_month, exp_year, cvc },
      });
      return [null, token];
    } catch (Err) {
      return [Err, null];
    }
  }
  async create_customer({ source, name, email, metadata }) {
    try {
      const customer = await this.stripe.customers.create({
        source: source,
        name,
        email,
        metadata,
      });
      return [null, customer];
    } catch (Err) {
      return [Err, null];
    }
  }
  async create_intent(model: ICreatePaymentIntent) {
    try {
      const { amount, currency, metadata, customerId } = model;
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: currency,
        metadata: metadata,
        customer: customerId,
        payment_method_types: ['card'],
        confirm: true,
      });
      return [null, paymentIntent];
    } catch (err) {
      return [err, null];
    }
  }
}
