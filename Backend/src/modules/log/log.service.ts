import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isDefined } from 'class-validator';
import { Filter, ObjectId } from 'mongodb';
import { Collection, Connection, Types } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Pagination } from '../../dto';
import { getPagination } from '../../pagination';
import { searchKeyword } from '../../search';
import { LogSearchDto } from './dto';

@Injectable()
export class LogService extends BaseLogger {
  private readonly logCollection: Collection;
  private readonly pcLogCollection: Collection;
  private readonly accountCollection: Collection;
  private readonly couponCollection: Collection;
  private readonly serverCollection: Collection;
  private readonly proxyCollection: Collection;
  private readonly accountErrorCollection: Collection;
  private readonly clientCollection: Collection;
  private readonly log2Collection: Collection;
  private readonly log3Collection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(LogService.name);

    this.logCollection = this.connection.collection('log');
    this.pcLogCollection = this.connection.collection('pc-log');
    this.accountCollection = this.connection.collection('accounts');
    this.couponCollection = this.connection.collection('coupons');
    this.serverCollection = this.connection.collection('servers');
    this.proxyCollection = this.connection.collection('proxy');
    this.accountErrorCollection = this.connection.collection('accounts_error');
    this.clientCollection = this.connection.collection('clients');
    this.log2Collection = this.connection.collection('log2');
    this.log3Collection = this.connection.collection('log3');
  }

  async getLogList(query: LogSearchDto) {
    this._logger.log(`getLogList: ${JSON.stringify(query)}`);
    const { page: queryPage, size = 100, keyword } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<unknown> = {};

    if (keyword) {
      filter['server'] = searchKeyword(keyword);
    }

    const [totalRecords, data] = await Promise.all([
      this.logCollection.count(filter),
      this.logCollection.find<Record<string, unknown>>(filter).skip(skip).limit(take).sort({ _id: 'desc' }).toArray()
    ]);

    return { page, totalRecords, data };
  }

  async summaryLog(client: string, query: { from: string; to: string; last: number }) {
    this._logger.log(`getLogList: ${JSON.stringify(query)}`);
    const { from, to, last } = query;
    const today = new Date();
    let fromDate;

    if (last) {
      fromDate = new Date(today.getTime() - 60000 * last);
    } else if (from) {
      fromDate = new Date(from);
    } else {
      fromDate = new Date(today.getTime() - 60000 * 60 * 24);
    }

    const toDate = to ? new Date(to) : new Date();

    const filter: Filter<unknown> = {
      server: new RegExp(`${client}-`),
      $and: [{ createdAt: { $gt: fromDate } }, { createdAt: { $lt: toDate } }]
    };

    const [data, servers] = await Promise.all([
      this.logCollection.find<Record<string, string | string[] | Date>>(filter).sort({ _id: 1 }).toArray(),
      this.serverCollection.find({ name: new RegExp(`${client}-`) }).toArray()
    ]);

    const result = {
      // duration: ((toDate.getTime() - fromDate.getTime()) / 1000 / 60 / 60).toFixed(1) + ' hours - 1009:0628',
      email: data.length,
      video: 0,
      server: {},
      servers: []
      // data: {},
      // count: {}
    };
    servers.forEach((s) => {
      result.server[s.name] = { email: 0, video: 0, zero: 0 };
    });
    data.forEach((d: { video: string[]; email: string; server: string }) => {
      if (result.server[d.server]) {
        result.server[d.server].email++;
        result.server[d.server].video += d.video?.length || 0;
        // if (d.video.length === 1) result[d.server].one++;
        if (d.video.length === 0) result.server[d.server].zero++;
      }
      result.video += d.video?.length || 0;
      // result.count[d.video?.length] = (result.count[d.video?.length] || 0) + 1;
      // result.data[d.email] = (result.data[d.email] || 0) + (d.video?.length || 0);
    });

    result.servers = Object.keys(result.server).map((key) => ({ name: key, ...result.server[key] }));
    result.server = undefined;

    return result;
  }

  async summaryAds(client: string, query: { from: string; to: string; last: number; summary: boolean }) {
    this._logger.log(`getLogList: ${JSON.stringify(query)}`);
    const { from, to, last } = query;
    const today = new Date();
    let fromDate;

    if (last) {
      fromDate = new Date(today.getTime() - 60000 * last);
    } else if (from) {
      fromDate = new Date(from);
    } else {
      fromDate = new Date(today.getTime() - 60000 * 60 * 24);
    }

    const toDate = to ? new Date(to) : new Date();

    const filter: Filter<unknown> = {
      server: new RegExp(`${client}-`),
      $and: [{ createdAt: { $gt: fromDate } }, { createdAt: { $lt: toDate } }]
    };

    const [data, servers] = await Promise.all([
      this.logCollection.find<Record<string, string | string[] | Date>>(filter).toArray(),
      this.serverCollection.find({ name: new RegExp(`${client}-`) }).toArray()
    ]);

    const result = {
      email: data.length,
      ads: 0,
      server: {},
      servers: []
    };
    servers.forEach((s) => {
      result.server[s.name] = { email: 0, ads: 0, zero: 0 };
    });
    data.forEach((d: { ads: string[]; email: string; server: string }) => {
      if (result.server[d.server]) {
        result.server[d.server].email++;
        result.server[d.server].ads += d.ads?.length || 0;
        if ((d.ads || '').length === 0) result.server[d.server].zero++;
      }
      result.ads += d.ads?.length || 0;
    });

    result.servers = Object.keys(result.server).map((key) => ({ name: key, ...result.server[key] }));
    result.server = undefined;

    return result;
  }

  async insertLog(input: Record<string, unknown>) {
    this._logger.log(`insertLog input: ${JSON.stringify(input)}`);

    const id = new Types.ObjectId();
    const [x, account] = await Promise.all([
      this.logCollection.insertOne({ _id: id, ...input, createdAt: new Date() }),
      this.accountCollection.findOne({ email: input.email })
    ]);

    if (input.error) {
      const error_acc = await this.accountCollection.findOneAndDelete({ email: input.email });
      await this.accountErrorCollection.insertOne({ ...error_acc.value, error: true, message: 'speedbump' });
      await this.accountCollection.updateOne(
        { email: input.email },
        { $set: { error: true, server: 'error', message: input.message, url: input.url } }
      );
      return;
    }
    const updateDocument = {};
    if (input.isPremium !== undefined && input.isPremium !== account.isPremium) {
      updateDocument['isPremium'] = input.isPremium;
    }
    if (input.message === 'COMPLETED') {
      updateDocument['server'] = 'none';
    } else if (input.message !== 'SUCCESS') {
      updateDocument['container'] = null;
    }
    if (input.password) {
      updateDocument['password'] = input.password;
      updateDocument['oldPassword'] = account.password;
    }
    if (input.channels) {
      updateDocument['channels'] = input.channels;
    }
    if (input.recoveryEmail) {
      updateDocument['recoveryEmail'] = input.recoveryEmail;
      updateDocument['oldRecoveryEmail'] = account.recoveryEmail;
    }
    if (Object.keys(updateDocument).length > 0) {
      await this.accountCollection.updateOne({ email: input.email }, { $set: updateDocument });
    }

    return { id: id.toString() };
  }

  async insertLog2(input: Record<string, unknown>) {
    this._logger.log(`insertLog2 input: ${JSON.stringify(input)}`);

    const id = new Types.ObjectId();
    await this.log2Collection.insertOne({ _id: id, ...input, createdAt: new Date() });

    return { id: id.toString() };
  }

  async insertLog3(input: Record<string, unknown>) {
    this._logger.log(`insertLog2 input: ${JSON.stringify(input)}`);

    const id = new Types.ObjectId();
    await this.log3Collection.insertOne({ _id: id, ...input, createdAt: new Date() });

    return { id: id.toString() };
  }

  async randomProxy() {
    this._logger.log(`randomProxy`);

    const [proxy, accounts] = await Promise.all([
      this.proxyCollection.find({ _id: { $gte: new ObjectId('6324f71fa6ac5bd77e46d5d2') } }).toArray(),
      this.accountCollection.find({ server: 'thuan-2' }).toArray()
    ]);
    if (accounts.length === 0 || proxy.length === 0) return;

    const queries = [];
    for (let i = 0; i < accounts.length; i++) {
      const p = PROXY[Math.floor(Math.random() * PROXY.length)];
      queries.push(this.accountCollection.updateOne({ _id: accounts[i]._id }, { $set: { proxy: p } }));
    }

    await Promise.all(queries);

    return accounts.length;
  }

  async resetProxy() {
    this._logger.log(`resetProxy`);

    const accounts = await this.accountCollection.find({ server: /nghingo/ }).toArray();
    if (accounts.length === 0) return;
    // const servers = new Set()

    // const queries :AnyBulkWriteOperation<Document>[] = [];
    accounts.forEach(async (acc) => {
      console.log(acc.email);
      const log = await this.logCollection.findOne({ email: acc.email, video: { $ne: [] } });
      if (log) {
        console.log(log.proxy);
        const server = acc.server.replaceAll(':nghingo', '');
        await this.accountCollection.updateOne({ _id: acc._id }, { $set: { server, proxy: log.proxy } });
      }
    });

    // console.log(queries)

    // await this.accountCollection.bulkWrite(queries);

    return accounts.length;
  }

  async getPCLogs(query: Pagination) {
    this._logger.log(`getPCLogs: ${JSON.stringify(query)}`);
    const { page: queryPage, size = 100 } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<unknown> = {};

    const [totalRecords, data] = await Promise.all([
      this.pcLogCollection.count(filter),
      this.pcLogCollection.find<Record<string, unknown>>(filter).skip(skip).limit(take).sort({ _id: 'desc' }).toArray()
    ]);

    return { page, totalRecords, data };
  }

  async getPcDetail(id: string) {
    this._logger.log(`getPcDetail: ${id}`);
    const result = await this.pcLogCollection.findOne({ _id: new ObjectId(id) });
    return { ...result };
  }

  async getDetail(id: string) {
    this._logger.log(`getDetail: ${id}`);
    const result = await this.logCollection.findOne({ _id: new ObjectId(id) });
    return { ...result };
  }

  async insertPCLog(input: Record<string, unknown>) {
    this._logger.log(`insertPCLog input: ${JSON.stringify(input)}`);

    const id = new Types.ObjectId();

    const queries: Promise<unknown>[] = [this.pcLogCollection.insertOne({ _id: id, ...input, createdAt: new Date() })];

    if (input.email) {
      const flags: Record<string, any> = {};

      if (input.error) {
        const error_acc = await this.accountCollection.findOneAndDelete({ email: input.email });
        queries.push(this.accountErrorCollection.insertOne({ ...input, ...error_acc.value }));
      } else {
        if (isDefined(input.pcUsed)) flags.pcUsed = input.pcUsed;
        if (isDefined(input.isPremium)) flags.isPremium = input.isPremium;
        if (input.pcUsed) {
          flags.error = false;
          flags.message = null;
        }
        if ((input.isPremium && input.message !== 'PREMIUM_ALREADY') || input.message === 'COUPON_USED') {
          queries.push(
            this.couponCollection.updateOne({ code: input.code }, { $set: { isUsed: true, updatedAt: new Date() } })
          );
        }

        // if (isDefined(input.proxy)) flags.proxy = input.proxy;

        queries.push(
          this.accountCollection.updateOne({ email: input.email }, { $set: { ...flags, updatedAt: new Date() } })
        );
      }
    }

    await Promise.all(queries);

    return { id: id.toString() };
  }

  async recoverAccount() {
    this._logger.log(`recoverAccount`);

    const accounts = await this.accountCollection.find({ server: /:nghingo/ }).toArray();
    if (accounts.length === 0) return { accounts: accounts.length };

    const queries: Promise<unknown>[] = [];

    await Promise.all(queries);

    return { queries: queries.length, accounts: accounts.length };
  }

  async initializeServers(username: string, input: { server: number; account: number; origin: string; type: string }) {
    const client = await this.clientCollection.findOne({ username });
    if (!client) return 'CLIENT NOT FOUND';

    const { server, account, origin, type } = input;
    const clientInsert = [];
    for (let i = 25; i <= server; i++) {
      clientInsert.push({
        name: `${username}-${i}`,
        terminate: 130,
        subscribe: 0,
        clientId: client._id.toString(),
        type
      });
      const acc = await this.accountCollection
        .find({ server: origin })
        .sort({ _id: 1 })
        .skip(account)
        .limit(1)
        .toArray();
      if (acc.length > 0) {
        await this.accountCollection.updateMany(
          { server: origin, _id: { $lt: acc[0]._id } },
          { $set: { server: `${username}-${i}`, updatedAt: new Date() } }
        );
      }
    }
    await this.serverCollection.insertMany(clientInsert);

    return clientInsert;
  }

  async refillServer(username: string, count: number, origin: string) {
    this._logger.log(`refillServer ---- username:${username},count:${count}`);
    if (!username || !count) return;

    const servers = await this.serverCollection.find({ name: new RegExp(username) }).toArray();

    for (let i = 0; i < servers.length; i++) {
      const current = await this.accountCollection.count({ server: servers[i].name });

      const account = await this.accountCollection
        .find({ server: origin })
        .sort({ _id: 1 })
        .skip(Number(count - current))
        .limit(1)
        .toArray();
      if (account.length > 0) {
        await this.accountCollection.updateMany(
          { server: origin, _id: { $lt: account[0]._id } },
          { $set: { server: servers[i].name, updatedDate: new Date() } }
        );
      }
    }
  }

  async summaryProxy() {
    this._logger.log(`refillServer`);

    const proxy = await this.proxyCollection.find().toArray();

    const queries = proxy.map((p) => {
      return this.accountCollection.count({ error: { $ne: true }, pcUsed: true, proxy: new RegExp(p.ip) });
    });

    const result = await Promise.all(queries);

    return proxy.map((p, index) => `${p.ip}:${result[index]}`);
  }
}

const PROXY = [
  '74.122.63.192:46534:K5uJU7gbzUdGBSm:ZOAWntQspnxj100',
  '74.122.57.160:48990:T10FhspJipCL5SO:WUeWAIYD3sbNoge',
  '74.122.60.121:48731:ALSMbSwFNVSNKpL:emRpezqGCnQshAK',
  '74.122.60.238:42916:D7pcY6fnt5NFKeG:B8TQiwkPDBYS1W0',
  '206.251.201.167:44426:rRVIhiQBSFhs5V3:AnHFfJClb7YH17S',
  '107.180.135.57:41376:xIgCIprLpQXBXUa:t2FYhu53FfB5skT',
  '107.180.135.209:46679:kjFKmoErGaTr6bJ:gcO0dkq6r7HAiGn',
  '107.180.130.208:44969:w4bRPMbW3rtHWO0:Z1Yiy47M9ISnmE7',
  '107.180.131.133:44918:b2Z3jEWk9yvQa7Z:U4gQ8LjlAY2D68S',
  '74.122.63.159:48473:GD4xLv89WtP8VDd:z2L5hH6bq1p7JzU',
  '175.110.74.187:42272:hQHKjSJNQE7zrmj:6eaXonYRdVCA6rI',
  '175.110.72.132:47348:b36EHvOAnPSnymb:1BaM2QvYQoTEfBE',
  '175.110.72.77:47160:b40QnD9iUovqZGP:k9XBA5ZE7QR8UXs',
  '175.110.72.9:43201:9G60ok4Na0Wt8Pn:lNI2ulhAuMcAuxg',
  '175.110.73.108:42276:I9qZ0wNwA19pqku:jcynCS8t5NWlQQu',
  '175.110.73.190:46252:ORvyb986hnJxIlQ:OUV2PgPCAccZfgh',
  '175.110.73.219:48390:HQsvdzkRquB4vDC:eeFUSEJE39o3DLO',
  '175.110.73.239:47051:63NBiTxyD70SHmg:NkEhKgBwmMlSpN9',
  '175.110.73.252:49940:hK57hJCZbwJi8Jj:FVN13TLsPMrldHU',
  '175.110.74.33:45911:QEIZxbwAa5bXxVq:n0enK0VPOxletMe',
  '175.110.75.103:49103:sfccHV9kEDfR04j:xQpw2J2EJBkur53',
  '175.110.75.112:47391:1fi9KsepM4SdBTE:gmIRDaMFpz13EPy',
  '175.110.75.119:44736:7DjbdSubDd6qA0k:FMFBOdUEWCJMAik',
  '175.110.75.160:42806:BSedpC0jRDMgjMz:HI1ml3K27B0oROI',
  '175.110.75.232:48347:ejsWzj5C29IPoZb:TOkckooL3kMwje9',
  '155.193.141.176:45911:BywSGeHxtIbMbm5:oQVt9s03KdU4iKK',
  '155.193.141.83:46943:kHWzwXyEbDcLjGu:s2TFK4JSELf4aiZ',
  '155.193.141.91:49919:8sagKEkuenTdQTJ:5Q2VrMQwngxNzSq',
  '155.193.142.231:47176:yct6X1BiAJNdwpD:FTBq0CGwNhtCq4n',
  '155.193.143.205:44773:gxHrjtqjhk7desY:BkFQqHVDgbgATgg',
  '155.193.143.254:44892:7dxdx2wBRwXJ4IL:MxqZUUcf5hdntLU',
  '155.193.143.60:48355:BWCb6CFHRHAQyXz:NHBng0ha0u819CV',
  '155.193.143.65:45282:pCXA4XDYD3QxawN:84zqQnlTussc2vn',
  '155.193.143.77:48981:CjCwhLy08JzuXIs:0ge5QrnO6hexbS2',
  '155.193.156.53:41981:KQQuaQ3KGTpdmlX:s9w1ao2VaGDLKSx',
  '155.193.157.0:49160:knxM8IqlKD8ePJ9:ELEgVRgAblL9iKM',
  '155.193.157.154:49922:dr2lWXcgjQaXzq5:XVcBpMTLnhfDHw4',
  '155.193.158.180:44165:HklDVGAYeUc1RVf:drILFDec8OF0xsA',
  '155.193.158.7:47474:PJ43GcqvSwZutSx:2NG7AwLUfpyXgOB',
  '155.193.159.54:44079:szvmiYCEKH7blvz:o5gvEPbyWlTIwmc',
  '161.77.239.123:47995:8lrFoCLPdZIsv6x:ALC3RigX2tNxdBe',
  '161.77.234.33:48757:u4CZgrc4qETjEV2:Q1vCBSYzYazV3uL',
  '161.77.238.178:42888:C3rMHklB7UzQIyE:YaQ5MkmjvobDlQC',
  '161.77.237.77:47511:JWvgOTO39N0htrW:OvLpeMISp920NKF',
  '161.77.239.155:44212:SJiyg61wspd6dep:IgjZ1eNthyhuMwy',
  '161.77.113.123:45420:boCYtl1mCu80QXN:OPHeLaFtBqU25Op',
  '161.77.237.74:41439:VAEJcyTItsQXQHM:Ljl9r6AtrTc742B',
  '161.77.235.116:42286:oNVwiJBASb2r1ms:PNkgItPzHWAq2zV',
  '161.77.234.211:45247:x1Q8KQm1fh1pgNP:KyONP48DBX7ErYl',
  '161.77.233.195:45719:ThgRW5yrCAf76Ma:6Upvem0B3L422Zw',
  '161.77.233.10:41246:LNNluMxKdjb0dmB:QmKdt46zXLxxL99',
  '161.77.232.2:44600:U713LKgcdrcWX7F:92dIM4ZRRyVbXCL',
  '161.77.115.13:46624:AdHYjB7VL1PGBaD:9ofCK2cmA5SPPIh',
  '161.77.113.217:46052:ZlE46KYJB0URKoA:jwkmbffw1lbXJov',
  '161.77.113.178:43525:8OfLTR7RNGqOX6t:HsY34vXcQ3uW3B6',
  '74.122.63.205:44420:rex7rntDQrx3VTJ:UYzszXG1V37h7aZ',
  '74.122.63.170:42763:Q7qlpPXism9vAUR:VUXKBBkaMMINJI2',
  '74.122.56.199:49534:JLXtwfwRsvylHwo:E5AnRpgdcD0g0u4',
  '74.122.59.202:43244:fPm7c6fWVTP3n15:ZIYmXqehUCxlSMa',
  '74.122.59.224:49843:PNUY3h8j019EdiZ:LscEQU2LxJY3Oxa',
  '74.122.61.170:46609:YLoBpJ8T0NjCOXt:Dm5fkKMDX2mqUDd',
  '74.122.61.140:42863:sBbkpAy8ZYiRpQq:C6vNvzJkUBctvsE',
  '74.122.61.107:46828:TjD2zFXnuZO5zlZ:EpwEpYG5gOxaiRt',
  '107.180.128.80:42970:mXW0wbUONmTPyAb:LP7wsMtRcz0oMKz',
  '107.180.129.10:42225:UuI5bEwtOQ2wOG7:KxLEU4tLksTgDAh',
  '107.180.132.181:44381:qoIGNNRUjuZPkHN:9z0gUrbR8zEIzFk',
  '107.180.134.216:42090:cij6t6McFXBr23S:qKf2XbjF1BN8Sdp',
  '107.180.134.232:46116:oIF8kAogZVRpoic:qiaAZpp74om6NWH',
  '206.251.200.5:48931:nn4Pu1119pqxCmI:6ouHH3ERRPmpxDg',
  '206.251.202.247:41314:w80XCWPywnjP4TB:sTiVl1bXa6xQxio',
  '104.159.7.152:48985:TmDPWyMyyxTizT8:lGXDpaoxYHHwXcq',
  '207.228.10.115:43728:oAvHJDQuUt5Agzq:FLmyrUqtxGhplcI',
  '207.228.0.158:47711:WJ5wokj9XBfAQHb:SaKBQ3pnmnc8dA8',
  '207.228.1.147:45993:2y4zpievmnuLneG:HQOiJCv7Tr5l9aU',
  '207.228.1.191:47632:up00kbk5ARjj8EF:rSSZVY6ab91bj9R',
  '207.228.3.139:49091:9P0Fs3jzRhOUT1a:wf93XIoFzNyKNWx',
  '207.228.10.159:49844:NUVSAz7ykcwgO9w:RlC4SbQg5tB8gzK',
  '207.228.11.33:49437:7g04hGldr8255lb:svebMq7aYLHf3vy',
  '207.228.2.194:49751:QFPep37sKywsdxh:Ej3BO4npJuMIyI4',
  '207.228.22.206:45773:dj31YyZ28vfcTPk:kMNHHAif38eratW',
  '207.228.63.124:44352:WKG0x81B0FqasK9:Q4MaNqOBdzW00VI',
  '207.228.45.186:44676:PeamHw1lxF9RLvy:JG2oMrQP53HocyL',
  '207.228.44.37:45191:dbNJGOm3U5MJ9ZB:RPsXXdpKvuGQNJ0',
  '207.228.40.72:41752:lpTSm6tAiDNRNbS:8UcXzoYxqzXolYp',
  '207.228.40.166:44098:HZIZsOJJ7G9vRkg:H616841hVGKyny5',
  '207.228.3.218:43290:qKxnb83hAAQ9qsV:aSkl53AcfAmTlZV'
];
