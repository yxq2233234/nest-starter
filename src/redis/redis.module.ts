import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
import { AppRedisConfig, REDIS_AUTH } from './types';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: REDIS_AUTH,
      useFactory: async (configService: ConfigService) => {
        const config = configService.getOrThrow('redis') as AppRedisConfig;
        const client = Redis.createClient({
          url: config.url,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_AUTH],
})
export class RedisModule {}
