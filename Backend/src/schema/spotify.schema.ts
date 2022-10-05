import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Spotify extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;
}

export const SpotifySchema = SchemaFactory.createForClass(Spotify);
