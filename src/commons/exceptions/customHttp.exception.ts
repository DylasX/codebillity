import { HttpException, HttpStatus } from '@nestjs/common';
import { customError } from '../interfaces/error.interface';

export class CustomHttpException extends HttpException {
  constructor(details: any) {
    const response: customError = {
      message: details.message,
      code: details.code ? details.code : 500,
      date: new Date(),
      redirect: details.redirect ? details.redirect : '',
    };
    super(response, response.code);
  }
}
