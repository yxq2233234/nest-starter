import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ApiSecurity } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiSecurity('apiKey'));
}
