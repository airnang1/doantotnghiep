import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../../schema/channel.schema';
import { Playlist, PlaylistSchema } from '../../schema/playlist.schema';
import { Video, VideoSchema } from '../../schema/video.schema';
import { VideoPlaylist, VideoPlaylistSchema } from '../../schema/videoPlaylist.schema';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Video.name, schema: VideoSchema },
      { name: VideoPlaylist.name, schema: VideoPlaylistSchema }
    ])
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule {}
