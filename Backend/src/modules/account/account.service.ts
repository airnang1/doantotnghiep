import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isDefined } from 'class-validator';
import { Filter } from 'mongodb';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { AccountsQueryDto } from './dto';

@Injectable()
export class AccountService extends BaseLogger {
  private accountCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(AccountService.name);

    this.accountCollection = this.connection.collection('accounts');
  }

  async getAccounts(query: AccountsQueryDto) {
    const { server, server_channel } = query;

    const filter: Filter<any> = {};

    if (isDefined(server)) {
      filter['server'] = server;
    }
    if (isDefined(server_channel)) {
      filter['server_channel'] = server_channel;
    }

    return this.accountCollection
      .find<any>(filter, { projection: { _id: 0, email: 1, password: 1, recoveryEmail: 1, proxy: 1 } })
      .toArray();
  }

  // async updateAccountFlags(email: string, body: UpdateAccountFlagsDto) {
  //   return this.accountCollection.updateOne({ email }, { $set: body }).then(({ modifiedCount }) => modifiedCount > 0);
  // }
}
