import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { customError } from '../interfaces/error.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const filterResponse: customError = {
      statusCode: status,
      date: new Date().toISOString(),
      message:
        process.env.NODE_ENV !== 'production'
          ? exception.message
          : 'Server Error',
    };

    console.log(exception);

    response.status(status).json(filterResponse);
  }
}
