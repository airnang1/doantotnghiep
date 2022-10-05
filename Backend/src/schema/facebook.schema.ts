import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Facebook extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;
}

export const FacebookSchema = SchemaFactory.createForClass(Facebook);
