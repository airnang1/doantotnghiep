import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Buffer, Workbook } from 'exceljs';
import { AnyBulkWriteOperation, Filter } from 'mongodb';
import { Collection, Connection } from 'mongoose';
import { Readable } from 'stream';
import { BaseLogger } from '../../core/logger';
import { Pagination } from '../../dto';
import { getPagination } from '../../pagination';
import { MailDto } from './dto';

const CSVKey = {
  1: 'email',
  2: 'password',
  3: 'recovery'
};

@Injectable()
export class MailService extends BaseLogger {
  private readonly mailCollection: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    super(MailService.name);

    this.mailCollection = this.connection.collection('mail');
    this.mailCollection.createIndex({ email: 'text' }).catch(() => false);
  }

  async getMailList(query: Pagination) {
    // TODO handle filter
    this._logger.log(`getMailList: ${JSON.stringify(query)}`);
    const { page: queryPage, size = 100 } = query;
    const { skip, page, take } = getPagination(queryPage, size);

    const filter: Filter<MailDto> = {};

    const [totalRecords, data] = await Promise.all([
      this.mailCollection.count(filter),
      this.mailCollection
        .find<MailDto>(filter, { projection: { email: 1, recovery: 1, status: 1 } })
        .skip(skip)
        .limit(take)
        .sort({ _id: 'desc' })
        .toArray()
    ]);

    return { page, totalRecords, data };
  }

  async updateStatus(email: string, status: string | boolean | number) {
    this._logger.log(`updateStatus: ${email}, ${status}`);
    await this.mailCollection.updateOne({ email: { $eq: email } }, { $set: { status } });
    return { status: true };
  }

  async importMail(buffer: Buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return this.handleCsvFile(readable);
  }

  private async handleCsvFile(readable: Readable) {
    const workSheet = await new Workbook().csv.read(readable);

    const data: { email?: string; password?: string; recovery?: string }[] = [];
    const bulkOps: AnyBulkWriteOperation[] = [];
    workSheet.eachRow((row) => {
      const item = {};
      row.eachCell((cell, cellIdx) => {
        if (CSVKey[cellIdx]) {
          item[CSVKey[cellIdx]] = cell.value;
        }
      });
      if (Object.keys(item).length) {
        data.push(item);
      }
    });

    for (const item of data) {
      bulkOps.push({ updateOne: { filter: { email: item.email }, update: { $set: item }, upsert: true } });
    }
    this.mailCollection.bulkWrite(bulkOps);
    return data;
  }
}
