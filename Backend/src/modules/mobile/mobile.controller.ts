import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { ChannelQueryDto, CostQueryDto, DashboardDto } from './dto';
import { MobileService } from './mobile.service';

@Controller('mobile')
export class MobileController {
  constructor(private readonly _service: MobileService) {}

  @Get('dashboard')
  @UsePipes(new MainValidationPipe())
  async getDashboard(@Query() query: DashboardDto) {
    return this._service.getDashboard(query);
  }

  @Get('channel')
  @UsePipes(new MainValidationPipe())
  async getChannels(@Query() query: ChannelQueryDto) {
    return this._service.getChannels(query);
  }

  @Get('cost')
  @UsePipes(new MainValidationPipe())
  async getCosts(@Query() query: CostQueryDto) {
    return this._service.getCosts(query);
  }

  @Get('drop-down')
  getClientForDropdown() {
    return this._service.getClientForDropdown();
  }
}
