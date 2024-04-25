import { IsBoolean, IsNumber } from 'class-validator';
import { AppFileConfig } from '../file/types';
import { AppDbConfig } from '../prisma/types';
import { AppRedisConfig } from '../redis/types';
import { AppJeepayConfig } from '../jeepay/types';
import { AppCaptchaConfig } from '../captcha/types';
import { AppWechatConfig } from '../wechat/types';
import { AppEmailConfig } from '../email/types';

export class AppConfig {
  app: AppConfigApp;
  db: AppDbConfig;
  redis: AppRedisConfig;
  file: AppFileConfig;
  captcha: AppCaptchaConfig;
  jeepay: AppJeepayConfig;
  wechat: AppWechatConfig;
  email: AppEmailConfig;
}

export class AppConfigApp {
  @IsNumber()
  port: number;
  @IsBoolean()
  logger: boolean;
}
