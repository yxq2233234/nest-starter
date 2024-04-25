import { AppCaptchaConfig, CaptchaService } from './types';
import Captcha20230305, * as $Captcha20230305 from '@alicloud/captcha20230305';
import * as $OpenApi from '@alicloud/openapi-client';
import Client from '@alicloud/captcha20230305/src/client';
import { Logger } from '@nestjs/common';

export class CaptchaAliyunService extends CaptchaService {
  private readonly logger = new Logger(CaptchaAliyunService.name);

  private client: Client;

  constructor(config: AppCaptchaConfig) {
    super();
    const apiConfig = new $OpenApi.Config({});
    apiConfig.accessKeyId = config.accessKey;
    apiConfig.accessKeySecret = config.accessSecret;
    apiConfig.endpoint = config.endpoint;
    apiConfig.connectTimeout = 5000;
    apiConfig.readTimeout = 5000;
    this.client = new Captcha20230305(apiConfig);
  }

  async verify(sceneId: string, verifyParam: string): Promise<{ success: boolean; reason: string }> {
    this.logger.log(`Verifying captcha for scene ${sceneId} with param ${verifyParam}`);
    const request = new $Captcha20230305.VerifyIntelligentCaptchaRequest({});
    request.sceneId = sceneId;
    request.captchaVerifyParam = verifyParam;
    try {
      const resp = await this.client.verifyIntelligentCaptcha(request);
      const success = resp.body.result.verifyResult;
      const reason = resp.body.result.verifyCode;
      this.logger.log(`Captcha verification result: ${success}, reason: ${reason}`);
      return {
        success,
        reason,
      };
    } catch (error) {
      this.logger.error(`Failed to verify captcha: ${error.message}`, error);
      // 建议使用您系统中的日志组件，打印异常
      // 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
      return {
        success: true,
        reason: 'Internal error',
      };
    }
  }
}
