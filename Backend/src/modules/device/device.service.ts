import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isDefined } from 'class-validator';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Device } from '../../schema/device.schema';
import { DesktopDeviceQueryDto } from './dto';

@Injectable()
export class DeviceService extends BaseLogger {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {
    super(DeviceService.name);
  }

  async getMobileDevices() {
    const filter: FilterQuery<Device> = { mobile: true };

    const [totalRecords, data] = await Promise.all([
      this.deviceModel.count(filter),
      this.deviceModel.find(filter, { _id: 0 })
    ]);

    return { page: 1, totalRecords, data };
  }

  async getDesktopDevices(query: DesktopDeviceQueryDto) {
    const { osType } = query;

    const filter: FilterQuery<Device> = { mobile: false };

    if (isDefined(osType)) {
      filter.navigatorUaDataPlatform = osType;
    }

    const [totalRecords, data] = await Promise.all([
      this.deviceModel.count(filter),
      this.deviceModel.find(filter, { _id: 0 })
    ]);

    return { page: 1, totalRecords, data };
  }

  async getDeviceById(id: string) {
    return this.deviceModel.findById(id);
  }
}
