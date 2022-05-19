import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data.result) {
          //checking properties that must not be sent to client
          if (Array.isArray(data.result)) {
            data.result = data.result.map((item) => {
              delete item.password;
              delete item.createdAt;
              delete item.updatedAt;
              delete item.deletedAt;
              //check this
              delete item.id;
              return item;
            });
          } else {
            delete data.result.password;
            delete data.result.createdAt;
            delete data.result.updatedAt;
            delete data.result.deletedAt;
            //check this
            delete data.result.id;
          }
        }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message,
          data: data.result,
        };
      }),
    );
  }
}
