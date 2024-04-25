import { IsNotEmpty } from 'class-validator';

export abstract class CaptchaService {
  abstract verify(sceneId: string, verifyParam: string): Promise<CaptchaResult>;
}

export interface CaptchaResult {
  success: boolean;
  reason: string;
}

export class AppCaptchaConfig {
  @IsNotEmpty()
  vendor: string;
  @IsNotEmpty()
  accessKey: string;
  @IsNotEmpty()
  accessSecret: string;
  @IsNotEmpty()
  endpoint: string;
  @IsNotEmpty()
  sceneId: string;
}
