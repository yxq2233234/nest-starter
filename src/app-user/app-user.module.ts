import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { AppUserController } from './app-user.controller';
import { WechatModule } from '../wechat/wechat.module';

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule, AuthModule, WechatModule],
  providers: [AppUserService],
  exports: [AppUserService],
  controllers: [AppUserController],
})
export class AppUserModule {}
