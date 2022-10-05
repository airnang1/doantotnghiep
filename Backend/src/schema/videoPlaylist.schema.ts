import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class VideoPlaylist extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  playlistId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  thumbnail: string;

  @Prop()
  duration: number;

  @Prop()
  tags: [string];

  @Prop()
  publishedAt: string;

  @Prop()
  likeCount: number;

  @Prop()
  viewCount: number;

  @Prop()
  commentCount: number;
}

export const VideoPlaylistSchema = SchemaFactory.createForClass(VideoPlaylist).index(
  { id: 1, playlistId: 1 },
  { unique: true }
);
