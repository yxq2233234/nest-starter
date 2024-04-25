import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest & { session: any } = context.switchToHttp().getRequest();
    const apiKey = request.headers['authorization'];
    if (!apiKey) return false;
    const session = this.authService.getSession(apiKey);
    if (!session) return false;
    request.session = session;
    return true;
  }
}
