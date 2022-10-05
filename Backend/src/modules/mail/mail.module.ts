import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
