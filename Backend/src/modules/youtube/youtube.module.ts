import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { Youtube, YoutubeSchema } from '../../schema/youtube.schema';
import { TopicController } from '../youtube/topic.controller';
import { TopicService } from '../youtube/topic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Youtube.name, schema: YoutubeSchema },
      { name: Channel.name, schema: ChannelSchema }
    ])
  ],
  controllers: [TopicController],
  providers: [TopicService]
})
export class YoutubeModule {}
