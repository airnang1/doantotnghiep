import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { Playlist, PlaylistSchema } from '../../schema/playlist.schema';
import { Video, VideoSchema } from '../../schema/video.schema';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Video.name, schema: VideoSchema }
    ])
  ],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
