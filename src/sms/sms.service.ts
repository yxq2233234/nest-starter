import { AppSmsConfig, SmsTemplate } from './types';
import { PrismaClient } from '@prisma/client';
import { BusinessError, commonBusinessErrorInfos } from '../error/business-error';

export abstract class SmsService {
  private templates: Record<string, SmsTemplate> = {};

  protected constructor(
    protected readonly config: AppSmsConfig,
    protected readonly prisma: PrismaClient,
  ) {
    config.templates.forEach((template: SmsTemplate) => {
      this.templates[template.name] = template;
    });
  }

  protected abstract doSendVerificationCode(mobile: string, code: string, template: SmsTemplate): Promise<void>;

  async sendVerificationCode(mobile: string, templateId: string) {
    const recent = await this.prisma.verificationSms.findFirst({
      where: {
        mobile,
        templateId,
        createdAt: {
          gte: new Date(Date.now() - 60000),
        },
      },
    });
    if (recent) {
      throw new BusinessError(commonBusinessErrorInfos.tooFrequent);
    }
    const template = this.templates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    const code = Math.random().toString().slice(-6);
    await this.doSendVerificationCode(mobile, code, template);
    await this.prisma.verificationSms.create({
      data: {
        mobile,
        code,
        templateId,
      },
    });
  }
}
