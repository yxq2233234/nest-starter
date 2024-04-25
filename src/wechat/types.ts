import { IsNotEmpty, IsString } from 'class-validator';

export class AppWechatConfig {
  @IsString()
  @IsNotEmpty()
  appid: string;
  @IsString()
  @IsNotEmpty()
  secret: string;
}

export interface WechatSession {
  openid: string;
  sessionKey: string;
  unionid: string;
}
