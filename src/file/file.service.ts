import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { GetObjectOptions, PresignedPutUrlObject, PutObjectOptions } from './types';

export abstract class FileService {
  abstract putObject(bucket: string, key: string, body: StreamingBlobPayloadInputTypes, options?: PutObjectOptions): Promise<void>;

  abstract getObject(bucket: string, key: string, dest: string): Promise<void>;

  abstract deleteObject(bucket: string, key: string): Promise<void>;

  abstract presignPutObject(bucket: string, key: string, options?: PutObjectOptions): Promise<PresignedPutUrlObject>;

  abstract signGetUrl(bucket: string, key: string, options?: GetObjectOptions): Promise<string>;
}
