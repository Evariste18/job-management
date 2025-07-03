import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus, BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erreur serveur interne';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any)?.message;
    }

    if (
      exception instanceof BadRequestException &&
      Array.isArray((exception.getResponse() as any)?.message)
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = (exception.getResponse() as any).message;
    }


    if (
      typeof exception === 'object' &&
      (exception as any).code === 11000 &&
      (exception as any).name === 'MongoServerError'
    ) {
      status = HttpStatus.CONFLICT;
      const key = Object.keys((exception as any).keyPattern || {})[0];
      message = `Duplicata détecté sur le champ : ${key}`;
    }


    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
