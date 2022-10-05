import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { DeviceService } from './device.service';
import { DesktopDeviceQueryDto } from './dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @UsePipes(new MainValidationPipe())
  async getMobileDevices() {
    return this.deviceService.getMobileDevices();
  }

  @Get('desktop')
  @UsePipes(new MainValidationPipe())
  async getDesktopDevices(@Query() query: DesktopDeviceQueryDto) {
    return this.deviceService.getDesktopDevices(query);
  }

  @Get(':id')
  async getDevice(@Param('id') id: string) {
    return this.deviceService.getDeviceById(id);
  }
}
