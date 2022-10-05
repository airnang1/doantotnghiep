import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Device extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  webglVendor: string;

  @Prop({ required: true })
  webglRenderer: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  cpuArchitecture: string;

  @Prop({ required: true })
  cpuBitness: string;

  @Prop({ required: true })
  navigatorVendor: string;

  @Prop({ required: true })
  navigatorPlatform: string;

  @Prop({ required: true })
  navigatorUaDataPlatform: string;

  @Prop({ required: true })
  platformVersion: string;

  @Prop({ required: true })
  screenWidth: number;

  @Prop({ required: true })
  screenHeight: number;

  @Prop({ required: true })
  screenDepth: number;

  @Prop({ required: true })
  deviceScaleFactor: number;

  @Prop({ required: true })
  maxTouchPoints: number;

  @Prop({ required: true })
  hardwareConcurrency: number;

  @Prop({ required: true })
  mobile: boolean;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
