import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFilter implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>() as any;

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response.statusCode,
          isSuccess: true,
          data,
        };
      }),
    );
  }
}
