import { Module } from '@nestjs/common';
import { AppUserModule } from './app-user/app-user.module';
import { WechatModule } from './wechat/wechat.module';
import { PrismaModule } from './prisma/prisma.module';
import { SmsModule } from './sms/sms.module';
import { RedisModule } from './redis/redis.module';
import { FileModule } from './file/file.module';
import { EmailModule } from './email/email.module';
import { CaptchaModule } from './captcha/captcha.module';
import { JeepayModule } from './jeepay/jeepay.module';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    AppUserModule,
    WechatModule,
    SmsModule,
    FileModule,
    EmailModule,
    CaptchaModule,
    JeepayModule,
    TodoModule,
  ],
})
export class AppModule {}
