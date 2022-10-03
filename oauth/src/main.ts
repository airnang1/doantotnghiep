import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { LoggingInterceptor } from './interceptor';

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
