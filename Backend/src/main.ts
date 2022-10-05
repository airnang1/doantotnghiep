import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { AppModule } from './app.module';
import { ConfigService } from './config';

class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const info = `url: ${req.url}, body: ${JSON.stringify(req.body)}, query: ${JSON.stringify(req.query)}`;
    this.logger.log(`Request ${info} start.`);
    return next.handle().pipe(tap(() => this.logger.log(`Request ${info} end.`)));
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  const port = ConfigService.getInstance().getNumber('PORT') || 3000;
  const host = ConfigService.getInstance().get('HOST') || 'localhost';
  await app.listen(port, host);

  new Logger().log(`Application is running on http://${host}:${port}`);
}
bootstrap();
