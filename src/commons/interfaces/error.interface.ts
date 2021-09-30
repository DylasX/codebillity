import { HttpStatus } from '@nestjs/common';

export interface customError {
  message: string;
  statusCode?: HttpStatus;
  date?: Date | string;
}
