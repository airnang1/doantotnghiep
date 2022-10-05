import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { getPagination, sortData } from '../../pagination';
import { Client } from '../../schema/client.schema';
import { Group } from '../../schema/group.schema';
import { Revenue } from '../../schema/revenue.schema';
import { Server } from '../../schema/server.schema';
import { searchKeyword } from '../../search';
import { hashValue } from '../../utils';
import { ClientDto, ClientEditDto, ClientSearchDto } from './dto';

@Injectable()
export class ClientService extends BaseLogger {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Server.name) private serverModel: Model<Server>,
    @InjectModel(Revenue.name) private revenueModel: Model<Revenue>
  ) {
    super(clientModel.name);
  }

  async checkGroupIdOfClient(id: string) {
    const isExistGroupId = await this.groupModel.count({ _id: id });
    return { isExist: Boolean(isExistGroupId) };
  }

  async checkUserNameOfClient(username: string) {
    const isExistUserName = await this.clientModel.count({ username: username });
    return Boolean(isExistUserName);
  }

  async createClient(data: ClientDto) {
    const { serverCount, ...client } = data;

    const resClient = await new this.clientModel({
      ...client,
      password: hashValue(client.password)
    }).save({ validateBeforeSave: false, validateModifiedOnly: false });
    const server = [];
    for (let i = 1; i <= serverCount; i++) {
      server.push({
        clientId: resClient._id,
        name: `${resClient.username}-${i}`,
        status: 1,
        createdAt: new Date()
      });
    }
    await this.serverModel.insertMany(server);
    return { id: resClient._id };
  }

  async getAll(query: ClientSearchDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc', keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);
    const where: FilterQuery<Client> = {};

    if (keyword) {
      where.$or = [
        { username: searchKeyword(keyword) },
        { name: searchKeyword(keyword) },
        { location: searchKeyword(keyword) }
      ];
    }

    const [totalRecords, clients] = await Promise.all([
      this.clientModel.count(where),
      this.clientModel
        .find(where, { name: 1, location: 1, username: 1, groupId: 1, createdAt: 1, profitRatio: 1 })
        .populate<{ serverCount: number }>('serverCount')
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
        .collation({ locale: 'en_US', numericOrdering: true })
    ]);

    const data = clients.map((client: any) => {
      return {
        id: client._id,
        name: client.name,
        location: client.location,
        username: client.username,
        serverCount: client.serverCount,
        profitRatio: client.profitRatio
      };
    });

    return { page, totalRecords, data };
  }

  async getServersByClient(id: string, query: ClientSearchDto) {
    const { page: queryPage, size, sortKey, sortOrder, keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);
    const where: FilterQuery<Server> = {};

    const client = await this.clientModel.findById(id);
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);

    where.clientId = id;
    if (keyword) {
      where.name = searchKeyword(keyword);
    }

    const [totalRecords, data] = await Promise.all([
      this.serverModel.count(where),
      this.serverModel.find(where, { clientId: 0 }).skip(skip).limit(take).sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }

  async getRevenuesByClient(id: string, query: ClientSearchDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc' } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const client = await this.clientModel.findById(id);
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);

    const [totalRecords, data] = await Promise.all([
      this.revenueModel.count({ clientId: id }),
      this.revenueModel
        .find({ clientId: id }, { clientId: 0 })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
    ]);

    return { page, totalRecords, data };
  }

  async getClientById(id: string) {
    // Check client exist
    const client = await this.clientModel.findById(id, { name: 1, location: 1, groupId: 1 });
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);

    const currentDate = new Date();
    const lastMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const [serverCount, group, revenueLastMonth] = await Promise.all([
      this.serverModel.count({ clientId: id }), // Count servers of Client
      this.groupModel.findById(client.groupId, { name: 1 }), // Get groupName of Client
      this.revenueModel.findOne({
        // Get revenue last month
        clientId: id,
        month: lastMonth,
        year: currentYear
      })
    ]);

    return {
      id: client._id,
      name: client.name,
      location: client.location,
      serverCount,
      groupName: group.name,
      month: revenueLastMonth.month,
      revenueLastMonth: revenueLastMonth.value
    };
  }

  async editClient(id: ObjectId, body: ClientEditDto) {
    const client = await this.clientModel.findById(id);
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);
    return await this.clientModel.findByIdAndUpdate(id, body);
  }

  async deleteClient(id: ObjectId) {
    const client = await this.clientModel.findById(id);
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client not found' }]);

    const [serverRunning] = await this.serverModel.find({ $and: [{ clientId: id }, { status: 1 }] });
    if (serverRunning) throw new BadRequestException([{ field: 'Server', message: 'Client have a running server' }]);

    await this.clientModel.findByIdAndDelete(id);
    await this.serverModel.deleteMany({ clientId: id });

    return { id };
  }
}
