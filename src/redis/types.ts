import { IsNotEmpty } from 'class-validator';

export const REDIS_AUTH = Symbol('REDIS:AUTH');

export class AppRedisConfig {
  @IsNotEmpty()
  url: string;
}
