import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
