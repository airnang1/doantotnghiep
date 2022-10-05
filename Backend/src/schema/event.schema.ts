import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: number; // 1. youtube, 2. facebook, 3. spotify, 4. website
}

export const EventSchema = SchemaFactory.createForClass(Event);
