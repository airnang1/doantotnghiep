import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
