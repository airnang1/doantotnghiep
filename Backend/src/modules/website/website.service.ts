import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Website } from '../../schema/website.schema';
import { WebsiteResponseDto, WebsiteSearchDto } from './dto';

@Injectable()
export class WebsiteService extends BaseLogger {
  constructor(@InjectModel(Website.name) private websiteModel: Model<Website>) {
    super(WebsiteService.name);
  }

  async createWebsite(input: WebsiteResponseDto) {
    return await new this.websiteModel(input).save({ validateBeforeSave: false, validateModifiedOnly: false });
  }

  async getAllWebsite(query: WebsiteSearchDto) {
    const { keyword, page = 1, size = 10 } = query;
    const where: FilterQuery<Website> = {};

    if (keyword) {
      where.name = { $regex: keyword };
    }
    const [totalRecords, data] = await Promise.all([
      this.websiteModel.count(where),
      this.websiteModel
        .find(where)
        .skip(size * (page - 1))
        .limit(size)
    ]);

    return { page, totalRecords, data };
  }

  async getWebsiteById(id: string) {
    return await this.websiteModel.findById(id);
  }

  async updateWebsite(id: string, input: WebsiteResponseDto) {
    return await this.websiteModel.findByIdAndUpdate(id, input, { new: true });
  }

  async deleteWebsite(id: string) {
    await this.websiteModel.deleteOne({ _id: id });
    return { status: true };
  }
}
