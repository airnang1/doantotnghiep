import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isDefined } from 'class-validator';
import { Filter } from 'mongodb';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Pagination } from '../../dto';
import { getPagination } from '../../pagination';
import { ProxyInsertDto, ProxyQueryDto, ProxyStatusDto } from './dto';

@Injectable()
export class ProxyService extends BaseLogger {
  private readonly proxyCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(ProxyService.name);

    this.proxyCollection = this.connection.collection('proxy');
    this.proxyCollection.createIndex({ ip: 1, port: 1 }, { unique: true }).catch(() => false);
  }

  async getProxies(query: ProxyQueryDto) {
    this._logger.log(`getDevices: ${JSON.stringify(query)}`);
    const { type } = query;

    const filter: Filter<ProxyInsertDto> = {};

    if (isDefined(type)) {
      filter['type'] = type;
    }

    const [totalRecords, data] = await Promise.all([
      this.proxyCollection.count(filter),
      this.proxyCollection
        .find<ProxyInsertDto>(filter, { projection: { ip: 1, type: 1 } })
        .sort({ _id: 'desc' })
        .toArray()
    ]);

    return { totalRecords, data };
  }

  async getProxyList(query: Pagination) {
    // TODO handle filter
    this._logger.log(`getProxyList: ${JSON.stringify(query)}`);
    const { page: queryPage, size = 100 } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<ProxyInsertDto> = {};

    const [totalRecords, data] = await Promise.all([
      this.proxyCollection.count(filter),
      this.proxyCollection
        .find<ProxyInsertDto>(filter, { projection: { username: 1, password: 1, ip: 1, status: 1, port: 1 } })
        .skip(skip)
        .limit(take)
        .sort({ _id: 'desc' })
        .toArray()
    ]);

    return { page, totalRecords, data };
  }

  async insertProxy(input: ProxyInsertDto) {
    const { ip, password, port, username } = input;
    this._logger.log(`insertProxy: ${ip}, ${port}, ${username}, ${password}`);
    const value = `${username}:${password}@${ip}:${port}`;

    const proxy = await this.proxyCollection.findOne({ ip, port });
    if (proxy) {
      throw new BadRequestException([{ field: 'proxy', message: 'IP and port already in use' }]);
    }
    const result = await this.proxyCollection.insertOne({ ip, port, password, username, value, createdAt: new Date() });
    return { id: result.insertedId.toString() };
  }

  async updateStatus(input: ProxyStatusDto) {
    const { ip, port, status } = input;
    this._logger.log(`updateStatus: ${ip}, ${port}, ${status}`);
    const result = await this.proxyCollection.updateOne({ ip, port }, { $set: { status, updatedAt: new Date() } });
    return { updated: result.modifiedCount };
  }
}
