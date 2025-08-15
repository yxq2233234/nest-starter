import { IsBoolean, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

import { AppFileConfig } from '../file/types';
import { AppDbConfig } from '../prisma/types';
import { AppRedisConfig } from '../redis/types';
import { AppJeepayConfig } from '../jeepay/types';
import { AppCaptchaConfig } from '../captcha/types';
import { AppWechatConfig } from '../wechat/types';
import { AppEmailConfig } from '../email/types';
import { AppSmsConfig } from '../sms/types';

export class AppConfigApp {
  @IsNumber()
  port: number;
  @IsBoolean()
  logger: boolean;
}

export class AppConfig {
  @IsObject()
  @Type(() => AppConfigApp)
  app: AppConfigApp;
  @IsObject()
  @Type(() => AppDbConfig)
  db: AppDbConfig;
  @IsObject()
  @Type(() => AppRedisConfig)
  redis: AppRedisConfig;
  @IsObject()
  @Type(() => AppFileConfig)
  file: AppFileConfig;
  @IsObject()
  @Type(() => AppCaptchaConfig)
  captcha: AppCaptchaConfig;
  @IsObject()
  @Type(() => AppJeepayConfig)
  jeepay: AppJeepayConfig;
  @IsObject()
  @Type(() => AppWechatConfig)
  wechat: AppWechatConfig;
  @IsObject()
  @Type(() => AppSmsConfig)
  sms: AppSmsConfig;
  @IsObject()
  @Type(() => AppEmailConfig)
  email: AppEmailConfig;
}

