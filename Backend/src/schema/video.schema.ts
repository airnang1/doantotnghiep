import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ strict: false })
export class Video extends Document {
  @Prop({ unique: true })
  id: string;

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

  @Prop({ type: mongoose.Schema.Types.String, ref: 'Channel' })
  channelId: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
