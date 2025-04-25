import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
interface ISentMailOptions {
  to: string;
  subject: string;
  message?: string;
  html?: string;
}
@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}
  async sendMail(model: ISentMailOptions) {
    const res = await this.mailService.sendMail(model);
    return res;
  }
}
