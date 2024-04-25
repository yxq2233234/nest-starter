import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SmsTemplate {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  sign: string;
  @IsString()
  @IsNotEmpty()
  templateCode: string;
}

export class AppSmsConfig {
  @IsIn(['tencent', 'aliyun'])
  vendor: string;
  @IsString()
  @IsNotEmpty()
  accessKey: string;
  @IsString()
  @IsNotEmpty()
  accessSecret: string;
  @IsString()
  @IsOptional()
  region: string; // Tencent SMS only
  @IsString()
  @IsOptional()
  appId: string; // Tencent SMS only
  @IsString()
  @IsOptional()
  endpoint: string; // Aliyun SMS only
  @IsArray()
  templates: SmsTemplate[];
}
