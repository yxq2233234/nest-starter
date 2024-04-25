import { Module } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
