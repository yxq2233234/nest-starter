import { Inject, Injectable } from '@nestjs/common';
import { AppSession } from './types';
import { RedisClientType } from 'redis';
import { REDIS_AUTH } from '../redis/types';

@Injectable()
export class AuthService {
  constructor(@Inject(REDIS_AUTH) private readonly redis: RedisClientType) {}

  async getSession(apiKey: string): Promise<AppSession> {
    const uid = await this.redis.get(`session:token:${apiKey}`);
    if (!uid) return null;
    const data = await this.redis.get(`session:sess:${uid}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  async replaceSession(param: AppSession, ttl: number) {
    const prev = await this.redis.get(`session:sess:${param.userId}`);
    if (prev) {
      await this.redis.del(`session:token:${JSON.parse(prev).token}`);
    }
    await this.redis.set(`session:sess:${param.userId}`, JSON.stringify(param), {
      EX: ttl,
    });
    await this.redis.set(`session:token:${param.token}`, param.userId, {
      EX: ttl,
    });
  }
}
