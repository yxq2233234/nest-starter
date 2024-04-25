import { FileS3Service } from './file-s3.service';
import axios from 'axios';
import { getConfig, initConfig } from '../config/configuration';

describe('FileS3Service', () => {
  let service: FileS3Service;

  const bucket = 'ghzl-test';
  const testKey = 'test.txt';

  beforeAll(async () => {
    await initConfig();
    const appConfig = getConfig();
    service = new FileS3Service(appConfig.file);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test upload', async () => {
    await service.putObject(bucket, testKey, 'test sample');
    await service.putObject(bucket, testKey, 'test sample2', {
      acl: 'public-read',
    });
    await service.putObject(bucket, testKey, 'test sample3', {
      acl: 'private',
      contentType: 'text/plain',
    });
  });

  it('test download', async () => {
    await service.getObject(bucket, testKey, 'test.txt');
  });

  it('test sign get', async () => {
    const url = await service.signGetUrl(bucket, testKey, {
      expiresIn: 3600,
    });
    console.log(url);
  });

  it('test presign put', async () => {
    const { url, headers } = await service.presignPutObject(bucket, testKey, {
      contentType: 'text/plain',
    });
    console.log(url, headers);
    await axios.put(url, 'hello world', {
      headers,
    });
  });

  it('test delete', async () => {
    await service.deleteObject(bucket, testKey);
  });
});
