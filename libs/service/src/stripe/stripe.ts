export interface IcardTokenOptions {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

export interface ICreatePaymentIntent {
  amount: string;
  currency: string;
  metadata: Record<string, any>;
  customerId: string;
}
