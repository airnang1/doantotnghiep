import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Client } from './client.schema';
import { Group } from './group.schema';

@Schema({ timestamps: true })
export class Revenue extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Client.name, required: true })
  clientId: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Group.name, required: true })
  groupId: Group;

  @Prop({ required: true })
  value: number;

  @Prop({ require: true })
  month: number;

  @Prop({ require: true })
  year: number;

  @Prop({ require: true, default: 1 })
  status: number;
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue).index(
  { clientId: 1, month: 1, year: 1 },
  { unique: true }
);
