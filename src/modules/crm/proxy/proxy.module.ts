import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpAdapterHost],
  controllers: [ProxyController],
  providers: []
})
export class ProxyModule {}
