import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Dashboard extends Document {
  @Prop({ required: true })
  monthDa: number;

  @Prop({ required: true })
  yearDa: number;

  @Prop()
  growServer: number;

  @Prop()
  group: number;

  @Prop()
  user: number;

  @Prop()
  percentServer: number;

  @Prop()
  totalTurnover: number;

  @Prop()
  normal: number;

  @Prop()
  chartTurnover: [];

  @Prop()
  growChannel: number;

  @Prop()
  totalChannel: number;

  @Prop()
  chartChannel: [];

  @Prop()
  value: number;

  @Prop()
  percentProfit: number;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
