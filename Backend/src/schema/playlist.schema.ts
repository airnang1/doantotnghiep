import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Channel } from './channel.schema';

@Schema({ strict: false })
export class Playlist extends Document {
  @Prop({ unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  thumbnail: string;

  @Prop()
  description: string;

  @Prop()
  publishedAt: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'Channel' })
  channelId: Channel;

  @Prop()
  itemCount: number;

  @Prop(
    raw([
      {
        id: { type: String },
        title: { type: String },
        duration: { type: Number },
        viewCount: { type: Number },
        likeCount: { type: Number },
        commentCount: { type: Number },
        publishedAt: { type: Date },
        tags: [String],
        thumbnail: { type: String }
      }
    ])
  )
  videos: Record<string, any>[];

  @Prop({ type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
