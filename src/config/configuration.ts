import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import { AppConfig } from './types';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

let config: AppConfig;

export function getConfig(): AppConfig {
  return config;
}

export async function initConfig() {
  const YAML_CONFIG_FILENAME = process.env.YAML_CONFIG_FILENAME || 'config.local.yaml';
  const rawConfig = yaml.load(readFileSync(YAML_CONFIG_FILENAME, 'utf8'));
  config = plainToInstance(AppConfig, rawConfig);
  const errors = await validate(config, { forbidUnknownValues: true });
  if (errors.length > 0) {
    // 打印完整错误对象（包括嵌套属性的错误）
    console.log('完整验证错误:', JSON.stringify(errors, null, 2));
    throw new Error('配置验证失败');
  }
}
