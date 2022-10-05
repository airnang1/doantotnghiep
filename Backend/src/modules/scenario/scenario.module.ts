import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { Playlist, PlaylistSchema } from '../../schema/playlist.schema';
import { Video, VideoSchema } from '../../schema/video.schema';
import { ChannelService } from '../channel/channel.service';
import { VideoService } from '../video/video.service';
import { ScenarioController } from './scenario.controller';
import { ScenarioService } from './scenario.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Video.name, schema: VideoSchema }
    ])
  ],
  controllers: [ScenarioController],
  providers: [ScenarioService, ChannelService, VideoService]
})
export class ScenarioModule {}
