import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true
  },
  id: false
})
export class Group extends Document {
  @Prop({ length: 255 })
  name: string;

  @Prop({ length: 255 })
  location: string;

  @Prop()
  turnover: number;

  @Prop({ type: mongoose.Schema.Types.Date, required: true, default: Date.now })
  createdAt: Date;
}
const GroupSchema = SchemaFactory.createForClass(Group);
GroupSchema.virtual('clients', {
  ref: 'Client',
  localField: '_id',
  foreignField: 'groupId',
  count: true
});
GroupSchema.virtual('servers', {
  ref: 'Server',
  localField: '_id',
  foreignField: 'groupId',
  count: true
});
GroupSchema.virtual('channels', {
  ref: 'Channel',
  localField: '_id',
  foreignField: 'groupId',
  count: true
});
GroupSchema.virtual('revenue', {
  ref: 'Revenue',
  localField: '_id',
  foreignField: 'groupId',

  justOne: true
});

export { GroupSchema };
