import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [MobileController],
  providers: [MobileService]
})
export class MobileModule {}
