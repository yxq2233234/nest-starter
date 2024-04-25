import { AppFileConfig, GetObjectOptions, PresignedPutUrlObject, PutObjectOptions } from './types';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { downloadFile } from './utils';
import { PutObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class FileS3Service extends FileService {
  private readonly client: S3Client;
  private readonly internalClient: S3Client;

  constructor(config: AppFileConfig) {
    super();
    const credentials = {
      accessKeyId: config.accessKey,
      secretAccessKey: config.accessSecret,
    };
    this.internalClient = new S3Client({
      credentials: credentials,
      endpoint: config.internalEndpoint,
      region: 'dummy',
    });
    this.client = new S3Client({
      credentials: credentials,
      endpoint: config.endpoint,
      region: 'dummy',
    });
  }

  async putObject(bucket: string, key: string, body: StreamingBlobPayloadInputTypes, options?: PutObjectOptions): Promise<void> {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };
    if (options?.acl) {
      params.ACL = options.acl;
    }
    const cmd = new PutObjectCommand(params);
    await this.internalClient.send(cmd);
  }

  private async getInternalSignedUrl(bucket: string, key: string): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await getSignedUrl(this.internalClient, cmd, {
      expiresIn: 3600,
    });
  }

  async getObject(bucket: string, key: string, dest: string): Promise<void> {
    const url = await this.getInternalSignedUrl(bucket, key);
    await downloadFile(url, dest);
  }

  async deleteObject(bucket: string, key: string): Promise<void> {
    const cmd = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.internalClient.send(cmd);
  }

  async presignPutObject(bucket: string, key: string, options?: PutObjectOptions): Promise<PresignedPutUrlObject> {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };
    const headers: Record<string, string> = {};
    if (options?.acl) {
      params.ACL = options.acl;
      headers['Acl'] = options.acl;
    }
    if (options?.contentType) {
      params.ContentType = options.contentType;
      headers['Content-Type'] = options.contentType;
    }
    const cmd = new PutObjectCommand(params);
    const url = await getSignedUrl(this.client, cmd);
    return {
      url,
      headers,
    };
  }

  async signGetUrl(bucket: string, key: string, options?: GetObjectOptions): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.client, cmd, options);
  }
}
