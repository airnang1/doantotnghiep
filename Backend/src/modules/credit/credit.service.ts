import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';

@Injectable()
export class CreditService extends BaseLogger {
  private creditCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(CreditService.name);

    this.creditCollection = this.connection.collection('credits');
  }

  // async getCredits(query: CouponsQueryDto) {
  //   const { server, isUsed } = query;

  //   const filter: Filter<Document> = {};

  //   if (isDefined(server)) {
  //     filter['server'] = server;
  //   }
  //   if (isDefined(isUsed)) {
  //     if (isUsed === 'true' || isUsed === '1') {
  //       filter['isUsed'] = true;
  //     } else {
  //       filter['isUsed'] = { $not: { $eq: true } };
  //     }
  //   }

  //   return (await this.creditCollection.find<any>(filter, { projection: { _id: 0, code: 1 } }).toArray()).map(
  //     ({ code }) => code
  //   );
  // }
}
