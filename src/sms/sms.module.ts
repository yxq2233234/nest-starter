import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AppSmsConfig } from './types';
import { SmsAliyunService } from './sms-aliyun.service';
import { PrismaClient } from '@prisma/client';
import { SmsTencentService } from './sms-tencent.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    {
      provide: SmsService,
      inject: [ConfigService, PrismaClient],
      useFactory: (configService: ConfigService, prisma: PrismaClient) => {
        const config = configService.getOrThrow<AppSmsConfig>('sms');
        if (config.vendor === 'aliyun') {
          return new SmsAliyunService(config, prisma);
        } else if (config.vendor === 'tencent') {
          return new SmsTencentService(config, prisma);
        } else {
          throw new Error(`Unsupported SMS vendor: ${config.vendor}`);
        }
      },
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
