import { Module } from '@nestjs/common';
import { FileS3Service } from './file-s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from './file.service';
import { AppFileConfig } from './types';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: FileService,
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow('file') as AppFileConfig;
        if (config.vendor === 's3') {
          return new FileS3Service(config);
        } else {
          throw new Error('Unsupported file service vendor');
        }
      },
    },
  ],
  exports: [FileService],
})
export class FileModule {}
