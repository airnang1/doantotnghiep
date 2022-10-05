import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ strict: false })
export class Youtube extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true, default: Date.now })
  createdAt: Date;
}

export const YoutubeSchema = SchemaFactory.createForClass(Youtube);
