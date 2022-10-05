import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Filter, ObjectId } from 'mongodb';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { getPagination } from '../../pagination';
import { ChannelQueryDto, CostQueryDto, DashboardDto } from './dto';

@Injectable()
export class MobileService extends BaseLogger {
  private readonly serverCollection: Collection;
  private readonly revenueCollection: Collection;
  private readonly profitCollection: Collection;
  private readonly clientCollection: Collection;
  private readonly channelCollection: Collection;
  private readonly videoCollection: Collection;
  private readonly costCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(MobileService.name);

    this.serverCollection = this.connection.collection('servers');
    this.revenueCollection = this.connection.collection('revenues');
    this.profitCollection = this.connection.collection('profits');
    this.clientCollection = this.connection.collection('clients');
    this.channelCollection = this.connection.collection('channels');
    this.videoCollection = this.connection.collection('videos');
    this.costCollection = this.connection.collection('costs');
  }

  async getDashboard(query: DashboardDto) {
    this._logger.log(`getDashboard`);

    const { clientId } = query;
    console.log('query', query);

    // Get client information
    const client = await this.clientCollection.findOne({ _id: new ObjectId(clientId) });
    if (!client) return {};

    // Get Revenue, profit, channel, server information
    const [revenue, profit, channel, server] = await Promise.all([
      this.revenueCollection.find<Record<string, unknown>>({ clientId }).toArray(),
      this.profitCollection.find<Record<string, unknown>>({ clientId }).toArray(),
      this.channelCollection.find<Record<string, unknown>>({ clientId }).toArray(),
      this.serverCollection.find<Record<string, unknown>>({ clientId }).toArray()
    ]);

    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
    const myServer = server.filter((s) => s.clientId === clientId).length;
    const myServerIncrease = server.filter((s) => s.clientId === clientId && s.createdAt > currentMonth).length;

    const serverRate = client.serverRate !== null ? client.serverRate : 7;
    const currentRevenue = (client.startRevenue || 0) + serverRate * myServer * (new Date().getTime() - client.startDate.getTime())/1000
    return {
      startDate: client.startDate,
      userRevenue: revenue.map((rev) => rev.value),
      profit: profit.map((pro) => pro.value),
      channel: channel.length,
      myServer,
      myServerIncrease,
      myRevenuePerSecond: serverRate * myServer,
      myProfitPerSecond: serverRate * myServer * (client?.profitRatio || 0.5),
      currentRevenue: currentRevenue > 0 ? currentRevenue : 0
    };
  }

  async getChannels(query: ChannelQueryDto) {
    this._logger.log(`getChannels`);
    const { clientId } = query;

    const { page: queryPage, size = 100 } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<unknown> = { clientId };

    const [totalRecords, data] = await Promise.all([
      this.channelCollection.count(filter),
      this.channelCollection
        .find<Record<string, unknown>>(filter)
        .skip(skip)
        .limit(take)
        .sort({ _id: 'desc' })
        .toArray()
    ]);

    return { page, totalRecords, data };
  }

  async getCosts(query: CostQueryDto) {
    this._logger.log(`getDashboard`);

    const { clientId } = query;

    // Get client information

    const currentDate = new Date();
    const firstDayOfMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? '0' : ''}${
      currentDate.getMonth() + 1
    }`;

    // Get channels
    const channels = await this.channelCollection.find<Record<string, unknown>>({ clientId }).toArray();

    // Count video, server and get cost
    const [videoCount, server, otherCost] = await Promise.all([
      this.videoCollection.count({
        channelId: { $in: channels.map((c) => c.id) },
        publishedAt: { $gt: firstDayOfMonth }
      }),
      this.serverCollection.count({ clientId }),
      this.costCollection.find<Record<string, unknown>>({ clientId, createdAt: { $gt: firstDayOfMonth } }).toArray()
    ]);

    return {
      operationCost: server * 300000,
      proxyCost: server * 1000000,
      videoCount,
      videoPrice: 300000,
      otherCost
    };
  }

  async getClientForDropdown() {
    return this.clientCollection
      .aggregate<Record<string, unknown>>([{ $project: { _id: 0, code: '$_id', label: '$username' } }])
      .toArray();
  }
}
