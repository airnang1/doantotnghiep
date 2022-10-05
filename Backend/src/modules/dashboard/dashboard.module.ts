import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
