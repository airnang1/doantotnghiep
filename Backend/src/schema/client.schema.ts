import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Group } from './group.schema';

@Schema({
  strict: false,
  toJSON: {
    virtuals: true
  },
  id: false,
  timestamps: true
})
export class Client extends Document {
  @Prop({ length: 255 })
  name: string;

  @Prop({ length: 255 })
  location: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupId: Group;

  @Prop({ required: true, length: 100 })
  username: string;

  @Prop({ required: true, length: 250 })
  password: string;
}

const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.virtual('group', {
  ref: Group.name,
  localField: 'groupId',
  foreignField: '_id',
  justOne: true
});

ClientSchema.virtual('serverCount', {
  ref: 'Server',
  localField: '_id',
  foreignField: 'clientId',
  count: true
});

ClientSchema.virtual('revenue', {
  ref: 'Revenue',
  localField: '_id',
  foreignField: 'clientId',
  justOne: true
});

export { ClientSchema };
