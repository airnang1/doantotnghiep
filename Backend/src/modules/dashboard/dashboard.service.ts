import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { DashboardDto } from './dto';

@Injectable()
export class DashboardService extends BaseLogger {
  private readonly dashboardCollection: Collection;
  constructor(@InjectConnection() private connection: Connection) {
    super(DashboardService.name);

    this.dashboardCollection = this.connection.collection('dashboards');
  }

  async getChartDashboard(query: DashboardDto) {
    const { name } = query;
    const dataChart = this.dashboardCollection.find<Record<string, unknown>>({ name }).toArray();
    return dataChart;
  }
}
