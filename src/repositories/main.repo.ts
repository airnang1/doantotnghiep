import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, PrismaPromise } from '@prisma/client';

import { PAGINATION } from '../constants';

export type Operation = PrismaPromise<unknown>;
class PageOptions {
  page: number;
  take: number;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor(page = PAGINATION.PAGE, take = PAGINATION.SIZE) {
    this.page = page;
    this.take = take;
  }
}
@Injectable()
export class MainRepo implements OnModuleInit, OnModuleDestroy {
  protected readonly _logger = new Logger(MainRepo.name);
  protected readonly _client: PrismaClient;

  constructor() {
    this._client = new PrismaClient({
      log: [{ emit: 'event', level: 'query' }]
    });
    this.checkMigration();
  }

  transaction<P extends PrismaPromise<any>>(arg: P[]) {
    return this._client.$transaction(arg);
  }

  onModuleDestroy() {
    this._client.$disconnect();
  }

  onModuleInit() {
    this._client.$connect();
  }

  getClient() {
    return this._client.client;
  }

  getUser() {
    return this._client.user;
  }

  getRole() {
    return this._client.role;
  }

  getPermission() {
    return this._client.permission;
  }

  getFeature() {
    return this._client.feature;
  }

  getPagination(page?: number, size?: number) {
    return new PageOptions(page, size);
  }

  private async checkMigration() {
    this._logger.log('checkMigration');
    if (process.env.NODE_ENV !== 'local')
      new Promise(async (resolve, reject) => {
        const { exec } = await import('child_process');
        const migrate = exec('yarn prisma migrate deploy', { env: process.env }, (err) =>
          err ? reject(err) : resolve(true)
        );
        // Forward stdout+stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
      });
  }
}
