import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Client } from './client.schema';

@Schema({ strict: false })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  thumbnail: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Client.name })
  clientId: Client;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
