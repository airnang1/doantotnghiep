import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { getPagination, sortData } from '../../pagination';
import { Client } from '../../schema/client.schema';
import { Server } from '../../schema/server.schema';
import { ServerDto, ServerEditDto, ServerRequestDto } from './dto';

@Injectable()
export class ServerService extends BaseLogger {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<Server>,
    @InjectModel(Client.name) private clientModel: Model<Client>
  ) {
    super(ServerService.name);
  }

  async createServer(serverRequest: ServerDto) {
    // Check client exist
    const client = await this.clientModel.findOne({ _id: new ObjectId(serverRequest.clientId) });
    if (!client) throw new BadRequestException([{ field: 'clientId', message: 'Client Not Found' }]);

    const currentServers = await this.serverModel.count({ clientId: serverRequest.clientId });

    const serverInsert = [];
    for (let i = currentServers + 1; i <= currentServers + serverRequest.count; i++) {
      serverInsert.push({
        clientId: serverRequest.clientId,
        name: `${client.username}-${i}`,
        status: 1,
        subscribe: 0,
        terminate: 130,
        createdAt: new Date()
      });
    }
    await this.serverModel.insertMany(serverInsert);

    return { status: true };
  }

  async getAll(query: ServerRequestDto) {
    const { page: queryPage, size, sortKey = 'createdAt', sortOrder = 'desc' } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    interface IServer {
      _id: string;
      name: string;
      status: number;
      client: {
        name: string;
      };
    }

    const [totalRecords, servers] = await Promise.all([
      this.serverModel.count(),
      this.serverModel
        .find<IServer>(null, null, {
          populate: {
            path: 'client',
            select: { name: 1 }
          }
        })
        .skip(skip)
        .limit(take)
        .sort(sortData(sortKey, sortOrder))
        .collation({ locale: 'en_US', numericOrdering: true })
    ]);

    const data = servers.map((server) => {
      return {
        id: server._id,
        name: server.name,
        clientName: server.client.name,
        status: server.status === 2 ? 'ON' : 'OFF'
      };
    });

    return { page, totalRecords, data };
  }

  async getServerByName(name: string) {
    return this.serverModel.findOne({ name });
  }

  async editServer(id: ObjectId, body: ServerEditDto) {
    const server = await this.serverModel.findById(id);
    if (!server) throw new BadRequestException([{ field: 'serverId', message: 'Server not found' }]);

    return await this.serverModel.findByIdAndUpdate(id, body);
  }

  async deleteServer(id: ObjectId) {
    const server = await this.serverModel.findById(id);
    if (!server) throw new BadRequestException([{ field: 'severId', message: 'Server not found' }]);

    const [serverRunning] = await this.serverModel.find({ $and: [{ clientId: id }, { status: 1 }] });
    if (serverRunning) throw new BadRequestException([{ field: 'Server', message: 'Server is running' }]);

    return { status: true };
  }
}
