import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isDefined } from 'class-validator';
import { Document, Filter } from 'mongodb';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { CouponsQueryDto } from './dto';

@Injectable()
export class CouponService extends BaseLogger {
  private couponCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(CouponService.name);

    this.couponCollection = this.connection.collection('coupons');
  }

  async getCoupons(query: CouponsQueryDto) {
    const { server, isUsed } = query;

    const filter: Filter<Document> = {};

    if (isDefined(server)) {
      filter['server'] = server;
    }
    if (isDefined(isUsed)) {
      if (isUsed === 'true' || isUsed === '1') {
        filter['isUsed'] = true;
      } else {
        filter['isUsed'] = { $not: { $eq: true } };
      }
    }

    return (await this.couponCollection.find<any>(filter, { projection: { _id: 0, code: 1 } }).toArray()).map(
      ({ code }) => code
    );
  }

  // async updateCouponFlags(code: string, body: UpdateCouponFlagsDto) {
  //   return this.couponCollection.updateOne({ code }, { $set: body }).then(({ modifiedCount }) => modifiedCount > 0);
  // }
}
