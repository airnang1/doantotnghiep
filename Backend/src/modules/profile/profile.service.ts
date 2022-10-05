import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isNotEmptyObject } from 'class-validator';
import { Filter, UpdateResult } from 'mongodb';
import { Collection, Connection, ObjectId, Types } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Pagination, ProxyStatus } from '../../dto';
import { getPagination } from '../../pagination';
import { ProfileInsertDto } from './dto';

interface ProxyDocument {
  _id: ObjectId;
  value: string;
  status: ProxyStatus;
}

interface MailDocument {
  _id: ObjectId;
  password: string;
  recovery: string;
  status: ProxyStatus;
}

@Injectable()
export class ProfileService extends BaseLogger {
  private readonly profileCollection: Collection;
  private readonly proxyCollection: Collection;
  private readonly mailCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(ProfileService.name);

    this.proxyCollection = this.connection.collection('proxy');
    this.mailCollection = this.connection.collection('mail');
    this.profileCollection = this.connection.collection('profile');
    this.profileCollection.createIndex({ email: 1 }, { unique: true }).catch(() => false);
  }

  async getProfileList(query: Pagination) {
    // TODO handle filter
    this._logger.log(`getProfileList: ${JSON.stringify(query)}`);
    const { page: queryPage, size = 100 } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<ProfileInsertDto> = {};

    const [totalRecords, data] = await Promise.all([
      this.profileCollection.count(filter),
      this.profileCollection
        .find<ProfileInsertDto>(filter, { projection: { email: 1, password: 1, recovery: 1, status: 1, proxy: 1 } })
        .skip(skip)
        .limit(take)
        .sort({ _id: 'desc' })
        .toArray()
    ]);

    return { page, totalRecords, data };
  }

  async insertProfile(input: ProfileInsertDto) {
    const { email, ip, port } = input;
    this._logger.log(`insertProfile input: ${email}, ${ip}, ${port}`);

    const [proxy, mail, isUsed] = await Promise.all([
      this.proxyCollection.findOne<ProxyDocument>({ ip, port }, { projection: { _id: 1, value: 1, status: 1 } }),
      this.mailCollection.findOne<MailDocument>(
        { email },
        { projection: { _id: 1, password: 1, recovery: 1, status: 1 } }
      ),
      this.profileCollection.count({ email })
    ]);

    if (!isNotEmptyObject(proxy) || proxy.status === ProxyStatus.USED) {
      this._logger.error(`Proxy invalid: ${JSON.stringify(proxy)}`);
      throw new BadRequestException([{ field: 'proxy', message: 'Proxy invalid' }]);
    }
    if (!isNotEmptyObject(mail) || mail.status === ProxyStatus.USED) {
      this._logger.error(`Email invalid: ${JSON.stringify(mail)}`);
      throw new BadRequestException([{ field: 'email', message: 'Email invalid' }]);
    }
    if (isUsed) {
      throw new BadRequestException([{ field: 'email', message: 'Email already in use' }]);
    }

    const { _id: proxyId, value } = proxy;
    const { _id: mailId, password, recovery } = mail;
    const id = new Types.ObjectId();

    const session = this.connection.getClient().startSession();
    await session.withTransaction(async () => {
      await this.profileCollection.insertOne({
        _id: id,
        email,
        password,
        recovery,
        proxy: value,
        proxyId,
        mailId,
        createdAt: new Date()
      });
      const proxyRs = await this.proxyCollection.updateOne(
        { _id: proxyId },
        { $set: { profileId: id, status: ProxyStatus.USED, updatedAt: new Date() } }
      );
      if (this.noUpdate(proxyRs)) {
        throw new Error('Proxy update failed');
      }
      const mailRs = await this.mailCollection.updateOne(
        { _id: mailId },
        { $set: { profileId: id, status: ProxyStatus.USED, updatedAt: new Date() } }
      );
      if (this.noUpdate(mailRs)) {
        throw new Error('Mail update failed');
      }
    });

    return { id: id.toString() };
  }

  async updateStatus(id: string, status: ProxyStatus) {
    this._logger.log(`updateStatus: ${id}, ${status}`);
    const result = await this.profileCollection.updateOne({ _ip: id }, { $set: { status, updatedAt: new Date() } });
    return { updated: result.modifiedCount };
  }

  noUpdate(result: UpdateResult) {
    return result.matchedCount === 0 || result.modifiedCount === 0;
  }
}
