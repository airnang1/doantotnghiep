import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { getPagination } from '../../pagination';
import { Channel } from '../../schema/channel.schema';
import { Client } from '../../schema/client.schema';
import { Group } from '../../schema/group.schema';
import { Revenue } from '../../schema/revenue.schema';
import { Server } from '../../schema/server.schema';
import { GroupDto, GroupResponseDto, YearDto } from './dto';

@Injectable()
export class GroupService extends BaseLogger {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Server.name) private serverModel: Model<Server>,
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
    @InjectModel(Revenue.name) private revenueModel: Model<Revenue>
  ) {
    super(GroupService.name);
  }

  async createGroup(input: GroupResponseDto) {
    return await new this.groupModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllGroup(query: GroupDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'asc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Group> = {};

    if (keyword) {
      where.$or = [{ name: { $regex: keyword, $options: 'i' } }, { location: { $regex: keyword, $options: 'i' } }];
    }

    const [totalRecords, groups] = await Promise.all([
      this.groupModel.count(where),
      this.groupModel
        .find(where)
        .populate<{ clients: number }>('clients', { username: 0, password: 0, profitRatio: 0 })
        .populate<{ servers: number }>('servers')
        .populate<{ channels: number }>('channels')
        .populate<{ revenue: { value: number } }>('revenue', { _id: 0, status: 0, createdAt: 0, clientId: 0 }, null, {
          sort: { createdAt: -1 },
          limit: 1
        })
        .skip(skip)
        .limit(take)
        .sort({ [sortKey]: sortOrder as mongoose.SortOrder })
    ]);

    const data = groups.map((a) => ({
      id: a._id,
      name: a.name,
      location: a.location,
      clients: a.clients,
      channels: a.channels,
      servers: a.servers,
      revenue: !a.revenue ? 0 : a.revenue.value,
      createdAt: a.createdAt
    }));

    return { page, totalRecords, data };
  }

  async getClientsByGroup(id: string, query: GroupDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Client> = { groupId: id };

    if (keyword) {
      where.$or = [{ name: { $regex: keyword, $options: 'i' } }, { location: { $regex: keyword, $options: 'i' } }];
    }

    const [totalRecords, data] = await Promise.all([
      this.clientModel.count(where),
      this.clientModel
        .find(where, { name: 1, location: 1, createdAt: 1 })
        .populate('serverCount')
        .skip(skip)
        .limit(take)
        .sort({ [sortKey]: sortOrder as mongoose.SortOrder })
    ]);

    return { page, totalRecords, data };
  }

  async getServersByGroup(id: string, query: GroupDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Server> = { groupId: id };

    if (keyword) {
      where.name = { $regex: keyword, $options: 'i' };
    }
    const [totalRecords, data] = await Promise.all([
      this.serverModel.count(where),
      this.serverModel
        .find(where, { groupId: 0 }, { populate: { path: 'client', select: { _id: 0, name: 1 } } })
        .skip(skip)
        .limit(take)
        .sort({ [sortKey]: sortOrder as mongoose.SortOrder })
    ]);

    return { page, totalRecords, data };
  }

  async getChannelsByGroup(id: string, query: GroupDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const where: FilterQuery<Channel> = { groupId: id };

    if (keyword) {
      where.title = { $regex: keyword, $options: 'i' };
    }

    const [totalRecords, data] = await Promise.all([
      this.channelModel.count(where),
      this.channelModel
        .find(where, { title: 1, publishedAt: 1, videoCount: 1, viewCount: 1 })
        .skip(skip)
        .limit(take)
        .sort({ [sortKey]: sortOrder as mongoose.SortOrder })
    ]);

    return { page, totalRecords, data };
  }

  async getMonthlyRevenueByGroup(id: string, query: YearDto) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const { queryYear = currentYear, size, keyword } = query;

    const where: FilterQuery<Revenue> = { groupId: id };

    if (keyword) {
      where.name = { $regex: keyword, $options: 'i' };
    }

    const [totalRecords, data] = await Promise.all([
      this.revenueModel.count(where),
      this.revenueModel.find(
        { $and: [where, { year: queryYear }] },
        { _id: 0, clientId: 0, groupId: 0, createdAt: 0, updatedAt: 0 },
        { sort: { month: 1 } }
      )
    ]);

    return { year: queryYear, totalRecords, data };
  }

  async getGroupForDropdown() {
    return await this.groupModel.aggregate([{ $project: { _id: 0, code: '$_id', label: '$name' } }]);
  }

  async getGroupById(id: ObjectId) {
    const group = await this.groupModel.findById(id);
    if (!group) throw new UnprocessableEntityException([{ field: 'groupId', message: 'Group not found' }]);

    const clients = await this.clientModel
      .find({ groupId: id }, { groupId: 1 })
      .populate('serverCount')
      .populate('revenue', { value: 1 }, undefined, {
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      });

    const serverCount = clients.reduce((pre, cur: any) => pre + (cur.serverCount || 0), 0);
    const revenueLastMonth = clients.reduce((pre, cur: any) => pre + (cur.revenue.value || 0), 0);

    return {
      id: group._id,
      name: group.name,
      location: group.location,
      clientCount: clients.length,
      serverCount,
      month: new Date().getMonth(),
      revenueLastMonth
    };
  }
}
