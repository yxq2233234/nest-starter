import { Logger } from '@nestjs/common';
import { AppSmsConfig, SmsTemplate } from './types';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { SmsService } from './sms.service';
import { PrismaClient } from '@prisma/client';

export class SmsAliyunService extends SmsService {
  private client: Dysmsapi20170525;

  constructor(
    protected readonly config: AppSmsConfig,
    protected readonly prisma: PrismaClient,
  ) {
    super(config, prisma);
    this.client = this.createClient(config);
  }

  private readonly logger = new Logger(SmsAliyunService.name);

  private createClient(smsConfig: AppSmsConfig): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
      accessKeyId: smsConfig.accessKey,
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
      accessKeySecret: smsConfig.accessSecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
    config.endpoint = smsConfig.endpoint;
    return new Dysmsapi20170525(config);
  }

  async doSendVerificationCode(phone: string, code: string, template: SmsTemplate) {
    this.logger.log(`发送验证码 ${code} 到 ${phone} 使用模板 ${template.name}`);
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: template.sign,
      templateCode: template.templateCode,
      templateParam: `{"code":"${code}"}`,
    });
    try {
      // 复制代码运行请自行打印 API 的返回值
      await this.client.sendSms(sendSmsRequest);
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
    }
  }
}
