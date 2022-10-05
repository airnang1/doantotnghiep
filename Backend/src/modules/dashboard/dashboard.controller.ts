import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from './dto';

@Controller('crm/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  @UsePipes(new MainValidationPipe())
  async getChartDashboard(@Query() query: DashboardDto) {
    return this.dashboardService.getChartDashboard(query);
  }
}
