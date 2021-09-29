import { HttpStatus } from '@nestjs/common';

export interface customError {
  message: string;
  code?: HttpStatus;
  redirect?: string;
  date?: Date;
}
