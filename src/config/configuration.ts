import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import { AppConfig } from './types';
import { validateOrReject } from 'class-validator';

let config: AppConfig = undefined;

export function getConfig(): AppConfig {
  return config;
}

export async function initConfig() {
  const YAML_CONFIG_FILENAME = process.env.YAML_CONFIG_FILENAME || 'config.local.yaml';
  config = yaml.load(readFileSync(YAML_CONFIG_FILENAME, 'utf8')) as AppConfig;
  await validateOrReject(config);
}
