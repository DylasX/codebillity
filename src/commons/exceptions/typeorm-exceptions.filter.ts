import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { customError } from '../interfaces/error.interface';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const { name } = exception;
    const errorResponse: customError = {
      date: new Date(),
      message: name,
      statusCode: 400,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
