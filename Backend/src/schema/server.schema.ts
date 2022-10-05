import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Client } from './client.schema';

@Schema({
  toJSON: {
    virtuals: true
  },
  id: false
})
export class Server extends Document {
  @Prop()
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
  clientId: Client;

  @Prop({ required: true, enum: [1, 2, 3] })
  status: number;

  @Prop()
  subscribe?: number;

  @Prop()
  terminate?: number;

  @Prop()
  createdAt: Date;
}

const ServerSchema = SchemaFactory.createForClass(Server);
ServerSchema.virtual('client', {
  ref: Client.name,
  localField: 'clientId',
  foreignField: '_id',
  justOne: true
});

export { ServerSchema };
