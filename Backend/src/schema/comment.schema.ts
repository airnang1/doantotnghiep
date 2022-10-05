import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop()
  topicId: string;

  @Prop({ required: true })
  channelId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
