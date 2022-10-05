import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [ProxyController],
  providers: [ProxyService]
})
export class ProxyModule {}
