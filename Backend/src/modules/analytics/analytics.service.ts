import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { google } from 'googleapis';
import { Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Analytic } from '../../schema/analytics.schema';
import { Channel } from '../../schema/channel.schema';
import { AnalyticRequestDto } from './dto';

@Injectable()
export class AnalyticService extends BaseLogger {
  constructor(
    @InjectModel(Analytic.name) private analyticModel: Model<Analytic>,
    @InjectModel(Channel.name) private channelModel: Model<Channel>
  ) {
    super(AnalyticService.name);
  }

  async createAnalytic(id: string, input: AnalyticRequestDto) {
    const { accessToken } = input;
    const channel = await this.channelModel.findOne({ id }, { publishedAt: true });

    if (!channel) {
      throw new UnprocessableEntityException([{ field: 'channel', message: 'Channel is invalid' }]);
    }

    const publishedDate = new Date(channel.publishedAt);
    const month = (publishedDate.getMonth() + 1 < 10 ? '0' : '') + (publishedDate.getMonth() + 1);

    const getStartDate = `${new Date(publishedDate).getFullYear()}-${month}`;
    const myAuth = new google.auth.OAuth2();
    myAuth.setCredentials({ access_token: accessToken });

    const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: myAuth });

    const analytics = await youtubeAnalytics.reports.query({
      currency: 'VND',
      dimensions: 'month',
      startDate: `${getStartDate}-01`,
      endDate: `${this.getEndDate()}-01`,
      ids: `channel==${id}`,
      metrics: process.env.METRICS // views,redViews,comments,likes,dislikes,videosAddedToPlaylists,videosRemovedFromPlaylists,shares,estimatedMinutesWatched,estimatedRedMinutesWatched,averageViewDuration,averageViewPercentage,annotationClickThroughRate,annotationCloseRate,annotationImpressions,annotationClickableImpressions,annotationClosableImpressions,annotationClicks,annotationCloses,cardClickRate,cardTeaserClickRate,cardImpressions,cardTeaserImpressions,cardClicks,cardTeaserClicks,subscribersGained,subscribersLost,estimatedRevenue,estimatedAdRevenue,grossRevenue,estimatedRedPartnerRevenue,monetizedPlaybacks,playbackBasedCpm,adImpressions,cpm
    });

    const analyticsData = analytics.data.rows.map((item) => ({
      month: item[0],
      views: item[1],
      redViews: item[2],
      comments: item[3],
      likes: item[4],
      dislikes: item[5],
      videosAddedToPlaylists: item[6],
      videosRemovedFromPlaylists: item[7],
      shares: item[8],
      estimatedMinutesWatched: item[9],
      estimatedRedMinutesWatched: item[10],
      averageViewDuration: item[11],
      averageViewPercentage: item[12],
      annotationClickThroughRate: item[13],
      annotationCloseRate: item[14],
      annotationImpressions: item[15],
      annotationClickableImpressions: item[16],
      annotationClosableImpressions: item[17],
      annotationClicks: item[18],
      annotationCloses: item[19],
      cardClickRate: item[20],
      cardTeaserClickRate: item[21],
      cardImpressions: item[22],
      cardTeaserImpressions: item[23],
      cardClicks: item[24],
      cardTeaserClicks: item[25],
      subscribersGained: item[26],
      subscribersLost: item[27],
      estimatedRevenue: item[28],
      estimatedAdRevenue: item[29],
      grossRevenue: item[30],
      estimatedRedPartnerRevenue: item[31],
      monetizedPlaybacks: item[32],
      playbackBasedCpm: item[33],
      adImpressions: item[34],
      cpm: item[35],
      channelId: id
    }));

    analyticsData.forEach(
      async (a) =>
        await this.analyticModel.updateMany({ channelId: a.channelId, month: a.month }, { $set: a }, { upsert: true })
    );

    return { status: true };
  }

  private getEndDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1 < 10 ? '0' : '') + (currentDate.getMonth() + 1);

    return `${year}-${month}`;
  }

  async getAnalytics(id: string) {
    return await this.analyticModel.find({ channelId: id });
  }
}
