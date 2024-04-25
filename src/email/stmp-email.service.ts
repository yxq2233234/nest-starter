import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class StmpEmailService {
  private logger = new Logger(StmpEmailService.name);

  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get<string>('email.host'),
      port: configService.get<number>('email.port'),
      secure: configService.get<boolean>('email.secure'),
      auth: {
        user: configService.get<string>('email.user'),
        pass: configService.get<string>('email.pass'),
      },
    });
  }

  async sendSingleTextMail(to: string, subject: string, text: string) {
    this.logger.log(`Sending text email to ${to}`);
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('email.user'),
      to,
      subject,
      text,
    });
    this.logger.log(`Message sent: ${info.messageId}`);
  }

  async sendSingleHtmlMail(to: string, subject: string, html: string) {
    this.logger.log(`Sending html email to ${to}`);
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('email.user'),
      to,
      subject,
      html,
    });
    this.logger.log(`Message sent: ${info.messageId}`);
  }
}
