import { IsNotEmpty } from 'class-validator';

export class AppFileConfig {
  @IsNotEmpty()
  vendor: string;
  @IsNotEmpty()
  accessKey: string;
  @IsNotEmpty()
  accessSecret: string;
  @IsNotEmpty()
  internalEndpoint: string;
  @IsNotEmpty()
  endpoint: string;
}

export interface PutObjectOptions {
  acl?: 'public-read' | 'public-read-write' | 'private';
  contentType?: string;
}

export interface GetObjectOptions {
  expiresIn?: number;
}

export interface PresignedPutUrlObject {
  url: string;
  headers: Record<string, string>;
}
