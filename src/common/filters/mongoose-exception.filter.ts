import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

@Catch(Error)
export class MongoooseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionConstructorName = exception.constructor.name;
    let status = 500;

    switch (exceptionConstructorName) {
      case 'CastError':
        status = 400;
        response.status(status).json({
          statusCode: status,
          error: 'Invalid ObjectId',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      default:
        response.status(status).json({
          statusCode: status,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}
