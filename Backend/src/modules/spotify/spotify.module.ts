import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Spotify, SpotifySchema } from '../../schema/spotify.schema';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Spotify.name, schema: SpotifySchema }])],
  providers: [SpotifyService],
  controllers: [SpotifyController]
})
export class SpotifyModule {}
