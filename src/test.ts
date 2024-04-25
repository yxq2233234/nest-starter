import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { initConfig } from './config/configuration';

export async function createTestApp() {
  process.env.YAML_CONFIG_FILENAME = 'config.test.yaml';
  await initConfig();
  return await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
}
