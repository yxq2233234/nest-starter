import { Module } from '@nestjs/common';
import { CaptchaAliyunService } from './captcha-aliyun.service';
import { AppCaptchaConfig, CaptchaService } from './types';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: CaptchaService,
      useFactory: (configService: ConfigService) => {
        const captchaConfig = configService.getOrThrow<AppCaptchaConfig>('captcha');
        if (captchaConfig.vendor === 'aliyun') {
          return new CaptchaAliyunService(captchaConfig);
        } else {
          throw new Error('Unsupported captcha vendor');
        }
      },
    },
  ],
  exports: [CaptchaService],
})
export class CaptchaModule {}
