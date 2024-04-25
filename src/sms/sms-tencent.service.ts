import { Logger } from '@nestjs/common';
import { AppSmsConfig, SmsTemplate } from './types';
import * as tencentcloud from 'tencentcloud-sdk-nodejs-sms';
import { Client } from 'tencentcloud-sdk-nodejs-sms/tencentcloud/services/sms/v20210111/sms_client';
import { SmsService } from './sms.service';
import { PrismaClient } from '@prisma/client';

const SmsClient = tencentcloud.sms.v20210111.Client;

export class SmsTencentService extends SmsService {
  private client: Client;

  constructor(
    protected readonly config: AppSmsConfig,
    protected readonly prisma: PrismaClient,
  ) {
    super(config, prisma);
    this.client = this.createClient();
  }

  private readonly logger = new Logger(SmsTencentService.name);

  private createClient() {
    const clientConfig = {
      credential: {
        secretId: this.config.accessKey,
        secretKey: this.config.accessSecret,
      },
      region: this.config.region,
      profile: {
        httpProfile: {
          endpoint: 'sms.tencentcloudapi.com',
        },
      },
    };

    // 实例化要请求产品的client对象,clientProfile是可选的
    return new SmsClient(clientConfig);
  }

  async doSendVerificationCode(phone: string, code: string, template: SmsTemplate) {
    this.logger.log(`发送验证码 ${code} 到 ${phone} 使用模板 ${template.name}`);
    const params = {
      SmsSdkAppId: this.config.appId,
      SignName: template.sign,
      TemplateId: template.templateCode,
      TemplateParamSet: [code],
      PhoneNumberSet: [`+86${phone}`],
    };
    await this.client.SendSms(params);
  }
}
