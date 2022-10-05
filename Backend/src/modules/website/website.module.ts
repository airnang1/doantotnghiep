import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from '../../schema/website.schema';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }])],
  providers: [WebsiteService],
  controllers: [WebsiteController]
})
export class WebsiteModule {}
