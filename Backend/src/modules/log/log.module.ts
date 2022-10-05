import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [LogController],
  providers: [LogService]
})
export class LogModule {}
