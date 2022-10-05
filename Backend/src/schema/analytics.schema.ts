import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false })
export class Analytic extends Document {
  @Prop()
  month: string;

  @Prop()
  views: number;

  @Prop()
  redViews: number;

  @Prop()
  comments: number;

  @Prop()
  likes: number;

  @Prop()
  dislikes: number;

  @Prop()
  videosAddedToPlaylists: number;

  @Prop()
  videosRemovedFromPlaylists: number;

  @Prop()
  shares: number;

  @Prop()
  estimatedMinutesWatched: number;

  @Prop()
  estimatedRedMinutesWatched: number;

  @Prop()
  averageViewDuration: number;

  @Prop()
  averageViewPercentage: number;

  @Prop()
  annotationClickThroughRate: number;

  @Prop()
  annotationCloseRate: number;

  @Prop()
  annotationImpressions: number;

  @Prop()
  annotationClickableImpressions: number;

  @Prop()
  annotationClosableImpressions: number;

  @Prop()
  annotationClicks: number;

  @Prop()
  annotationCloses: number;

  @Prop()
  cardClickRate: number;

  @Prop()
  cardTeaserClickRate: number;

  @Prop()
  cardImpressions: number;

  @Prop()
  cardTeaserImpressions: number;

  @Prop()
  cardClicks: number;

  @Prop()
  cardTeaserClicks: number;

  @Prop()
  subscribersGained: number;

  @Prop()
  subscribersLost: number;

  @Prop()
  estimatedRevenue: number;

  @Prop()
  estimatedAdRevenue: number;

  @Prop()
  grossRevenue: number;

  @Prop()
  estimatedRedPartnerRevenue: number;

  @Prop()
  monetizedPlaybacks: number;

  @Prop()
  playbackBasedCpm: number;

  @Prop()
  adImpressions: number;

  @Prop()
  cpm: number;

  @Prop()
  channelId: string;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
