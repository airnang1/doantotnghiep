import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facebook, FacebookSchema } from '../../schema/facebook.schema';
import { FacebookController } from './facebook.controller';
import { FaceBookService } from './facebook.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Facebook.name, schema: FacebookSchema }])],
  controllers: [FacebookController],
  providers: [FaceBookService]
})
export class FaceBookModule {}
