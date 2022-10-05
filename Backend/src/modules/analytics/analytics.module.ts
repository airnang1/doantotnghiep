import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytic, AnalyticSchema } from '../../schema/analytics.schema';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { AnalyticController } from './analytics.controller';
import { AnalyticService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema },
      { name: Channel.name, schema: ChannelSchema }
    ])
  ],
  controllers: [AnalyticController],
  providers: [AnalyticService]
})
export class AnalyticsModule {}
