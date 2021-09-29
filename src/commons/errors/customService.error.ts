import { HttpStatus } from '@nestjs/common';
import { customError } from '../interfaces/error.interface';

export class ServiceError extends Error {
  private code: HttpStatus;
  private redirect: string;
  private date: Date;
  constructor(details: customError, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }

    this.name = 'Service error';

    this.code = details.code;
    this.date = details.date;
    this.redirect = details.redirect;
    this.message = details.message;
  }
}
