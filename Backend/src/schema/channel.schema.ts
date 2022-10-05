import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Youtube } from './youtube.schema';

@Schema({ strict: false })
export class Channel extends Document {
  @Prop({ unique: true })
  id: string;

  @Prop()
  title: string;

  @Prop()
  thumbnail: string;

  @Prop()
  publishedAt: string;

  @Prop()
  description: string;

  @Prop()
  viewCount: number;

  @Prop()
  subscriberCount: number;

  @Prop()
  videoCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Youtube' })
  topicId: Youtube;

  @Prop()
  type: string;

  @Prop()
  googleToken: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop()
  clientId: string;

  @Prop()
  clientGoogle: string;

  @Prop()
  secretGoogle: string;

  @Prop()
  refreshToken: string;

  @Prop()
  videos: [];

  @Prop()
  duration: number;

  @Prop()
  other: boolean;

  @Prop()
  subscribe: number;

  @Prop()
  keywords: string[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
