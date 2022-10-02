import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const info = `url: ${req.url}, body: ${JSON.stringify(req.body)}, query: ${JSON.stringify(req.query)}`;
    this.logger.log(`Request ${info} start.`);
    return next.handle().pipe(tap(() => this.logger.log(`Request ${info} end.`)));
  }
}
