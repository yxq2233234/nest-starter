import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BusinessError, commonBusinessErrorInfos } from './business-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let responseBody: any;
    let httpStatus: number;
    if (exception instanceof UnauthorizedException) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      responseBody = {
        errorCode: commonBusinessErrorInfos.unauthorized.errorCode,
        message: commonBusinessErrorInfos.unauthorized.message,
      };
    } else if (exception instanceof BusinessError) {
      httpStatus = exception.httpStatus;
      responseBody = {
        statusCode: exception.errorCode,
        message: exception.message,
      };
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: commonBusinessErrorInfos.unknown.errorCode,
        message: commonBusinessErrorInfos.unknown.message,
        detail: (exception as any)?.message,
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
